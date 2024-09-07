use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use tracing::error;

use crate::repositories::user_repository::UserRepository;

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
