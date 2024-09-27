use crate::controllers::user_controller::ResetPasswordRequest;
use crate::models::password_reset_tokens::PasswordResetToken;
use crate::models::users::{SimpleUser, User};
use crate::utils::jwt::JwtManager;
use crate::{
  controllers::user_controller::{AuthRequest, LoginRequest, RegisterRequest},
  errors::UserError,
};
use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::{presigning::PresigningConfig, Client};
use axum::async_trait;
use bcrypt::{hash, verify};
use chrono::Local;
use sqlx::PgPool;
use std::{sync::Arc, time::Duration};
use validator::{Validate, ValidateEmail, ValidationErrors};

#[derive(Clone)]
pub struct UserRepository {
  database: Arc<PgPool>,
  r2: Arc<Client>,
}

const BUCKET_NAME: &str = "noteworthy-images-bucket";

#[async_trait]
pub trait UserRepositoryTrait {
  fn new(database: &Arc<PgPool>, r2: &Arc<Client>) -> Self;
  async fn log_user(
    &self,
    req: &LoginRequest,
    jwt_manager: &JwtManager,
  ) -> Result<String, UserError>;
  async fn create_user(&self, req: RegisterRequest) -> Result<String, UserError>;
  async fn authorize_user(
    &self,
    req: &AuthRequest,
    jwt_manager: &JwtManager,
  ) -> Result<String, UserError>;
  async fn link_user_account(&self, id: &str) -> Result<(), UserError>;
  async fn new_reset_token(&self, email: String) -> Result<PasswordResetToken, UserError>;
  async fn reset_user_password(
    &self,
    token: &str,
    req: ResetPasswordRequest,
  ) -> Result<(), UserError>;
  async fn upload_user_profile_image(&self, user_id: &str, image: Vec<u8>)
    -> Result<(), UserError>;
  async fn find_user_profile_image(&self, id: String) -> Result<String, UserError>;
}

#[async_trait]
impl UserRepositoryTrait for UserRepository {
  fn new(database: &Arc<PgPool>, r2: &Arc<Client>) -> Self {
    Self {
      database: Arc::clone(database),
      r2: Arc::clone(r2),
    }
  }
  async fn log_user(
    &self,
    req: &LoginRequest,
    jwt_manager: &JwtManager,
  ) -> Result<String, UserError> {
    req.validate()?;
    let user = match find_user_by_email(&req.email, &self.database).await? {
      Some(user) => user,
      None => return Err(UserError::UserNotFound),
    };
    let correct_password =
      verify(&req.password, &user.password.unwrap()).map_err(UserError::DecryptError)?;

    if !correct_password {
      return Err(UserError::InvalidCredentials);
    }

    let token = jwt_manager
      .generate_jwt(user.id, user.email.unwrap(), user.name, user.image)
      .expect("Error generation JWT token");

    Ok(token)
  }

  async fn create_user(&self, req: RegisterRequest) -> Result<String, UserError> {
    req.validate()?;

    let user = find_user_by_email(&req.email, &self.database).await?;
    if user.is_some() {
      return Err(UserError::UserAlreadyExist);
    }

    let hash_password = hash(req.password, 10)?;

    let query = r#"
      INSERT INTO users (id, email, name, password)
      VALUES ($1, $2, $3, $4) RETURNING id;
    "#;

    let id: String = sqlx::query_scalar(query)
      .bind(cuid2::create_id())
      .bind(req.email)
      .bind(req.name)
      .bind(hash_password)
      .fetch_one(&*self.database)
      .await?;

    Ok(id)
  }

  async fn authorize_user(
    &self,
    req: &AuthRequest,
    jwt_manager: &JwtManager,
  ) -> Result<String, UserError> {
    req.validate()?;

    let query = r#"
      SELECT id, email, name, image FROM users
      LEFT JOIN accounts on accounts.user_id = users.id
      WHERE accounts.provider_account_id = $1 AND accounts.provider = $2
    "#;

    let user = sqlx::query_as::<_, SimpleUser>(query)
      .bind(&req.id)
      .bind(&req.provider)
      .fetch_one(&*self.database)
      .await?;

    let token = jwt_manager
      .generate_jwt(user.id, user.email, Some(user.name), user.image)
      .expect("Generated JWT");

    Ok(token)
  }

  async fn link_user_account(&self, id: &str) -> Result<(), UserError> {
    let query = r#"
      UPDATE users
      SET email_verified = $2
      WHERE id = $1
    "#;

    let localtime = Local::now().naive_local();

    sqlx::query(query)
      .bind(id)
      .bind(localtime)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  async fn new_reset_token(&self, email: String) -> Result<PasswordResetToken, UserError> {
    if !email.validate_email() {
      let validate_err = ValidationErrors::new();
      return Err(UserError::Validation(validate_err));
    }

    let query = "SELECT * FROM password_reset_tokens WHERE email = $1";
    let password_token = sqlx::query_as::<_, PasswordResetToken>(query)
      .bind(&email)
      .fetch_optional(&*self.database)
      .await?;

    if let Some(mut token) = password_token {
      if token.expires > Local::now().naive_local() {
        token.is_new = false;
        return Ok(token);
      }
    }

    let new_token = uuid::Uuid::new_v4();
    let expires_in = Local::now().naive_local() + chrono::Duration::hours(1);

    let insert_query = r#"
      INSERT INTO password_reset_tokens (email, token, expires)
      VALUES ($1, $2, $3) RETURNING *
    "#;

    let mut new_reset_token = sqlx::query_as::<_, PasswordResetToken>(insert_query)
      .bind(email)
      .bind(new_token)
      .bind(expires_in)
      .fetch_one(&*self.database)
      .await?;
    
    new_reset_token.is_new = true;

    Ok(new_reset_token)
  }

  async fn reset_user_password(
    &self,
    token: &str,
    req: ResetPasswordRequest,
  ) -> Result<(), UserError> {
    req.validate()?;

    let query = r#"
      SELECT * FROM password_reset_tokens
      WHERE token = $1
    "#;

    let password_reset_token = match sqlx::query_as::<_, PasswordResetToken>(query)
      .bind(token)
      .fetch_optional(&*self.database)
      .await?
    {
      Some(reset_token) => reset_token,
      None => return Err(UserError::TokenNotFound),
    };

    if password_reset_token.expires < Local::now().naive_local() {
      return Err(UserError::TokenExpired);
    }

    let hash_password = hash(req.password, 10)?;

    let get_user_query = "SELECT * FROM users WHERE email = $1";
    let update_password_query = "UPDATE users SET password = $2 WHERE id = $1";
    let delete_token_query = "DELETE FROM password_reset_tokens WHERE id = $1";

    let mut transaction = self.database.begin().await?;

    let user = sqlx::query_as::<_, User>(get_user_query)
      .bind(password_reset_token.email)
      .fetch_one(&mut *transaction)
      .await?;
    sqlx::query(update_password_query)
      .bind(user.id)
      .bind(hash_password)
      .execute(&mut *transaction)
      .await?;
    sqlx::query(delete_token_query)
      .bind(password_reset_token.id)
      .execute(&mut *transaction)
      .await?;

    transaction.commit().await?;

    Ok(())
  }

  async fn upload_user_profile_image(
    &self,
    user_id: &str,
    image: Vec<u8>,
  ) -> Result<(), UserError> {
    let stream = ByteStream::from(image);

    let _ = self
      .r2
      .put_object()
      .bucket(BUCKET_NAME)
      .key(user_id)
      .body(stream)
      .content_type("image/png")
      .send()
      .await?;

    Ok(())
  }

  async fn find_user_profile_image(&self, id: String) -> Result<String, UserError> {
    let presigned_url = &self
      .r2
      .get_object()
      .bucket(BUCKET_NAME)
      .key(&id)
      .presigned(
        PresigningConfig::builder()
          .expires_in(Duration::from_secs(3600))
          .build()
          .unwrap(),
      )
      .await
      .map_err(|e| UserError::PresignedUrl(e))?;
    Ok(presigned_url.uri().to_owned())
  }
}

async fn find_user_by_email(email: &str, pool: &PgPool) -> Result<Option<User>, UserError> {
  let query = r#"
      SELECT * FROM users
      WHERE email = $1;
    "#;

  let user = sqlx::query_as::<_, User>(query)
    .bind(email)
    .fetch_optional(pool)
    .await?;

  Ok(user)
}
