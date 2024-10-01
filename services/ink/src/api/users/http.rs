use super::model::{SimpleUser, User};
use crate::errors::UserError;
use crate::models::password_reset_tokens::PasswordResetToken;
use crate::utils::middleware::AuthUser;
use crate::AppState;

use crate::utils::image::{resize_and_reduce_image, upload_image_to_r2};
use aws_sdk_s3::presigning::PresigningConfig;
use axum::extract::Multipart;
use axum::{
  extract::{Json, Path},
  routing::{get, post},
  Extension, Router,
};
use bcrypt::{hash, verify};
use chrono::Local;
use serde::Deserialize;
use sqlx::PgPool;
use std::time::Duration;
use uuid::Uuid;
use validator::{Validate, ValidateEmail, ValidationErrors};

pub fn router() -> Router {
  let user_related_routes = Router::new()
    .route("/profile", post(upload_user_profile_image))
    .route("/profile/:id", get(find_user_profile_image))
    .route("/reset-password/:token", post(reset_user_password))
    .route("/new-password-token/:email", post(new_reset_token));

  Router::new()
    .route("/login", post(log_user))
    .route("/register", post(create_user))
    .route("/authorize", post(authorize_user))
    .route("/link-account", post(link_user_account))
    .route("/refresh-token/:token", get(refresh_user_token))
    .nest("/users", user_related_routes)
}

const BUCKET_NAME: &str = "noteworthy-images-bucket";

#[derive(Deserialize, Validate)]
struct LoginRequest {
  #[validate(email)]
  pub email: String,
  #[validate(length(min = 6))]
  pub password: String,
}

async fn log_user(
  Extension(state): Extension<AppState>,
  Json(req): Json<LoginRequest>,
) -> Result<Json<String>, UserError> {
  req.validate()?;

  let user = match find_user_by_email(&req.email, &state.database).await? {
    Some(user) => user,
    None => return Err(UserError::UserNotFound),
  };

  let correct_password =
    verify(&req.password, &user.password.unwrap()).map_err(UserError::DecryptError)?;

  if !correct_password {
    return Err(UserError::InvalidCredentials);
  }

  let token = state
    .jwt_manager
    .generate_jwt(user.id, user.email.unwrap(), user.name, user.image)
    .expect("Error generating JWT token");

  Ok(Json(token))
}

#[derive(Deserialize, Validate)]
struct RegisterRequest {
  #[validate(length(min = 6))]
  pub name: String,
  #[validate(length(min = 6))]
  pub password: String,
  #[validate(email)]
  pub email: String,
}

async fn create_user(
  Extension(state): Extension<AppState>,
  Json(req): Json<RegisterRequest>,
) -> Result<String, UserError> {
  req.validate()?;

  let user = find_user_by_email(&req.email, &state.database).await?;
  if user.is_some() {
    return Err(UserError::UserAlreadyExist);
  }

  let hash_password = hash(req.password, 10)?;

  let query = r#"
        INSERT INTO users (id, email, name, password)
        VALUES ($1, $2, $3, $4) RETURNING id;
    "#;

  let id: String = sqlx::query_scalar(query)
    .bind(Uuid::new_v4())
    .bind(req.email)
    .bind(req.name)
    .bind(hash_password)
    .fetch_one(&state.database)
    .await?;

  Ok(id)
}

async fn refresh_user_token(
  Extension(state): Extension<AppState>,
  Path(token): Path<String>,
) -> Result<Json<String>, UserError> {
  let decoded_token = match state.jwt_manager.decode_jwt(&token, false) {
    Ok(token) => token,
    Err(e) => {
      tracing::error!("Error decoding JWT token: {:?}", e);
      return Err(e);
    }
  };

  let refreshed_token = state.jwt_manager.refresh_jwt(decoded_token.claims)?;

  Ok(Json(refreshed_token))
}

#[derive(Deserialize, Validate)]
struct AuthRequest {
  pub id: String,
  pub provider: String,
}

async fn authorize_user(
  Extension(state): Extension<AppState>,
  Json(req): Json<AuthRequest>,
) -> Result<String, UserError> {
  req.validate()?;

  let query = r#"
        SELECT id, email, name, image FROM users
        LEFT JOIN accounts ON accounts.user_id = users.id
        WHERE accounts.provider_account_id = $1 AND accounts.provider = $2
    "#;

  let user = sqlx::query_as::<_, SimpleUser>(query)
    .bind(&req.id)
    .bind(&req.provider)
    .fetch_one(&state.database)
    .await?;

  let token = state
    .jwt_manager
    .generate_jwt(user.id, user.email, Some(user.name), user.image)
    .expect("Generated JWT");

  Ok(token)
}

async fn link_user_account(
  Extension(state): Extension<AppState>,
  Path(id): Path<String>,
) -> Result<(), UserError> {
  let query = r#"
        UPDATE users
        SET email_verified = $2
        WHERE id = $1
    "#;

  let localtime = Local::now().naive_local();

  sqlx::query(query)
    .bind(id)
    .bind(localtime)
    .execute(&state.database)
    .await?;

  Ok(())
}

#[derive(Deserialize, Validate)]
struct ResetPasswordRequest {
  #[validate(length(min = 6))]
  pub password: String,
}

async fn new_reset_token(
  Path(email): Path<String>,
  Extension(state): Extension<AppState>,
) -> Result<Json<PasswordResetToken>, UserError> {
  if !email.validate_email() {
    let validate_err = ValidationErrors::new();
    return Err(UserError::Validation(validate_err));
  }

  let query = "SELECT * FROM password_reset_tokens WHERE email = $1";
  let password_token = sqlx::query_as::<_, PasswordResetToken>(query)
    .bind(&email)
    .fetch_optional(&state.database)
    .await?;

  if let Some(mut token) = password_token {
    if token.expires > Local::now().naive_local() {
      token.is_new = false;
      return Ok(Json(token));
    }
  }

  let new_token = Uuid::new_v4();
  let expires_in = Local::now().naive_local() + chrono::Duration::hours(1);

  let insert_query = r#"
        INSERT INTO password_reset_tokens (email, token, expires)
        VALUES ($1, $2, $3) RETURNING *
    "#;

  let mut new_reset_token = sqlx::query_as::<_, PasswordResetToken>(insert_query)
    .bind(email)
    .bind(new_token)
    .bind(expires_in)
    .fetch_one(&state.database)
    .await?;

  new_reset_token.is_new = true;

  Ok(Json(new_reset_token))
}

async fn reset_user_password(
  Extension(state): Extension<AppState>,
  Path(token): Path<String>,
  Json(req): Json<ResetPasswordRequest>,
) -> Result<(), UserError> {
  req.validate()?;

  let query = r#"
        SELECT * FROM password_reset_tokens
        WHERE token = $1
    "#;

  let password_reset_token = match sqlx::query_as::<_, PasswordResetToken>(query)
    .bind(token)
    .fetch_optional(&state.database)
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

  let mut transaction = state.database.begin().await?;

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
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  mut multipart: Multipart,
) -> Result<(), UserError> {
  let mut field = multipart
    .next_field()
    .await
    .map_err(|_| UserError::MultipartRequired)?
    .ok_or(UserError::MultipartRequired)?;

  let mut file_bytes = Vec::new();

  while let Some(chunk) = field
    .chunk()
    .await
    .map_err(|_| UserError::MultipartRequired)?
  {
    file_bytes.extend_from_slice(&chunk);
  }

  let compressed_image = resize_and_reduce_image(file_bytes)?;

  upload_image_to_r2(state.r2, BUCKET_NAME, &user.id, compressed_image).await?;
  Ok(())
}

async fn find_user_profile_image(
  Extension(state): Extension<AppState>,
  Path(id): Path<String>,
) -> Result<Json<String>, UserError> {
  let pre_signed_url = state
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

  Ok(Json(pre_signed_url.uri().to_string()))
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
