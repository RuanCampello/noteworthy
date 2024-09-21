use crate::models::users::{SimpleUser, User};
use crate::utils::jwt::JwtManager;
use crate::{
  controllers::user_controller::{AuthRequest, LoginRequest, RegisterRequest},
  errors::UserError,
};
use aws_sdk_s3::{presigning::PresigningConfig, Client};
use axum::async_trait;
use bcrypt::{hash, verify};
use sqlx::PgPool;
use std::{sync::Arc, time::Duration};
use validator::Validate;

#[derive(Clone)]
pub struct UserRepository {
  database: Arc<PgPool>,
  r2: Arc<Client>,
}

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
      LEFT JOIN account on account."userId" = users.id
      WHERE account."providerAccountId" = $1 AND account.provider = $2
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

  async fn find_user_profile_image(&self, id: String) -> Result<String, UserError> {
    let presigned_url = &self
      .r2
      .get_object()
      .bucket("noteworthy-images-bucket")
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
