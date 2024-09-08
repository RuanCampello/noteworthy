use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use tracing::error;

use crate::{
    app_state::EnvVariables,
    errors::TokenError,
    repositories::user_repository::UserRepository,
    utils::jwt::{refresh_jwt, JwtDecoder},
};

#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

pub async fn login(
    Extension(repository): Extension<UserRepository>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    return match repository.log_user(&payload).await {
        Err(e) => {
            error!("Error: {:#?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
        }
        Ok(token) => (StatusCode::OK, Json(token)).into_response(),
    };
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
            return (StatusCode::INTERNAL_SERVER_ERROR).into_response();
        }
    };

    (StatusCode::OK, Json(refreshed_token)).into_response()
}
