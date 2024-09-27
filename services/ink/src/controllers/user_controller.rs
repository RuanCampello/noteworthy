use crate::utils::image::resize_and_reduce_image;
use crate::utils::jwt::JwtManager;
use crate::utils::middleware::AuthUser;
use crate::{
  errors::TokenError,
  repositories::user_repository::{UserRepository, UserRepositoryTrait},
};
use axum::{
  extract::{Multipart, Path},
  http::StatusCode,
  response::IntoResponse,
  Extension, Json,
};
use serde::Deserialize;
use tracing::{error, info};
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct LoginRequest {
  #[validate(email)]
  pub email: String,
  #[validate(length(min = 6))]
  pub password: String,
}

pub async fn login(
  Extension(repository): Extension<UserRepository>,
  Extension(jwt_manager): Extension<JwtManager>,
  Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
  match repository.log_user(&payload, &jwt_manager).await {
    Err(e) => e.into_response(),
    Ok(token) => {
      info!("response on login {}", token);
      (StatusCode::OK, Json(token)).into_response()
    }
  }
}

pub async fn get_user_image(
  Extension(repository): Extension<UserRepository>,
  Path(id): Path<String>,
) -> impl IntoResponse {
  match repository.find_user_profile_image(id).await {
    Err(_) => StatusCode::NOT_FOUND.into_response(),
    Ok(url) => (StatusCode::OK, url).into_response(),
  }
}

#[derive(Deserialize, Validate)]
pub struct RegisterRequest {
  #[validate(length(min = 6))]
  pub name: String,
  #[validate(length(min = 6))]
  pub password: String,
  #[validate(email)]
  pub email: String,
}

pub async fn register(
  Extension(repository): Extension<UserRepository>,
  Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
  match repository.create_user(payload).await {
    Ok(id) => (StatusCode::CREATED, Json(id)).into_response(),
    Err(e) => e.into_response(),
  }
}
pub async fn refresh_handler(
  Path(old_token): Path<String>,
  Extension(jwt_manager): Extension<JwtManager>,
) -> impl IntoResponse {
  let decoded_old_token = match jwt_manager.decode_jwt(&old_token, false) {
    Ok(token) => token,
    Err(_) => {
      return (
        StatusCode::BAD_REQUEST,
        TokenError::InvalidFormat.to_string(),
      )
        .into_response()
    }
  };

  let refreshed_token = match jwt_manager.refresh_jwt(decoded_old_token.claims) {
    Ok(token) => token,
    Err(e) => {
      error!("Refresh token error {:#?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
  };

  (StatusCode::OK, Json(refreshed_token)).into_response()
}

#[derive(Deserialize, Validate)]
pub struct AuthRequest {
  pub id: String,
  pub provider: String,
}

pub async fn authorize(
  Extension(repository): Extension<UserRepository>,
  Extension(jwt_manager): Extension<JwtManager>,
  Json(payload): Json<AuthRequest>,
) -> impl IntoResponse {
  match repository.authorize_user(&payload, &jwt_manager).await {
    Ok(token) => (StatusCode::OK, token).into_response(),
    Err(e) => {
      error!("authorize_user error {:#?}", e);
      e.into_response()
    }
  }
}

pub async fn link_account(
  Path(id): Path<String>,
  Extension(repository): Extension<UserRepository>,
) -> impl IntoResponse {
  match repository.link_user_account(&id).await {
    Ok(_) => StatusCode::OK.into_response(),
    Err(e) => {
      error!("link_user_account error {:#?}", e);
      e.into_response()
    }
  }
}

pub async fn new_password_token(
  Extension(repository): Extension<UserRepository>,
  Path(email): Path<String>,
) -> impl IntoResponse {
  match repository.new_reset_token(email).await {
    Ok(token) => match token.is_new {
      true => (StatusCode::CREATED, Json(token)).into_response(),
      false => (StatusCode::OK, Json(token)).into_response(),
    },
    Err(e) => {
      error!("new_password_token error {:#?}", e);
      e.into_response()
    }
  }
}

#[derive(Deserialize, Validate)]
pub struct ResetPasswordRequest {
  #[validate(length(min = 6))]
  pub password: String,
}

pub async fn new_password(
  Extension(repository): Extension<UserRepository>,
  Path(token): Path<String>,
  Json(payload): Json<ResetPasswordRequest>,
) -> impl IntoResponse {
  match repository.reset_user_password(&token, payload).await {
    Ok(_) => StatusCode::OK.into_response(),
    Err(e) => {
      error!("reset_user_password error {:#?}", e);
      e.into_response()
    }
  }
}

pub async fn upload_profile_image(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<UserRepository>,
  mut multipart: Multipart,
) -> impl IntoResponse {
  while let Some(mut field) = multipart.next_field().await.expect("multipart error") {
    let mut file_bytes = Vec::new();

    while let Some(chunk) = field.chunk().await.expect("chunk") {
      file_bytes.extend_from_slice(&chunk);
    }

    let compressed_image = match resize_and_reduce_image(file_bytes) {
      Ok(compressed_image) => compressed_image,
      Err(e) => {
        error!("error converting user profile image {:?}", e);
        return e.into_response();
      }
    };

    return match repository
      .upload_user_profile_image(&user.id, compressed_image)
      .await
    {
      Ok(_) => StatusCode::CREATED.into_response(),
      Err(e) => {
        error!("upload_profile_image error {:#?}", e);
        e.into_response()
      }
    };
  }

  StatusCode::INTERNAL_SERVER_ERROR.into_response()
}
