use crate::{
  app_state::EnvVariables,
  errors::TokenError,
  repositories::user_repository::{UserRepository, UserRepositoryTrait},
  utils::jwt::{refresh_jwt, JwtDecoder},
};
use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use serde::Deserialize;
use tracing::{error, info};

#[derive(Deserialize)]
pub struct LoginRequest {
  pub email: String,
  pub password: String,
}

pub async fn login(
  Extension(repository): Extension<UserRepository>,
  Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
  match repository.log_user(&payload).await {
    Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    Ok(token) => {
      info!("response on login {}", token);
      (StatusCode::OK, Json(token)).into_response()
    }
  }
}

pub async fn get_user_from_email(
  Extension(repository): Extension<UserRepository>,
  Path(email): Path<String>,
) -> impl IntoResponse {
  match repository.find_user_by_email(&email).await {
    Ok(_) => StatusCode::OK.into_response(),
    Err(_) => StatusCode::NOT_FOUND.into_response(),
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

#[derive(Deserialize)]
pub struct RegisterRequest {
  pub name: String,
  pub password: String,
  pub email: String,
}

pub async fn register(
  Extension(repository): Extension<UserRepository>,
  Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
  match repository.create_user(payload).await {
    Ok(id) => (StatusCode::CREATED, Json(id)).into_response(),
    Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong").into_response(),
  }
}

pub async fn refresh_handler(Path(old_token): Path<String>) -> impl IntoResponse {
  let env = EnvVariables::from_env().expect("Env variables to be set");
  let decoded_old_token = match old_token.decode_jwt_with_exp(false) {
    Ok(token) => token,
    Err(_) => {
      return (
        StatusCode::BAD_REQUEST,
        TokenError::InvalidFormat.to_string(),
      )
        .into_response()
    }
  };

  let refreshed_token = match refresh_jwt(decoded_old_token.claims, &env.jwt_secret) {
    Ok(token) => token,
    Err(e) => {
      error!("Refresh token error {:#?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
  };

  (StatusCode::OK, Json(refreshed_token)).into_response()
}
