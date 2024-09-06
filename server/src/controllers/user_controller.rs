use axum::{extract::State, http::StatusCode, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use tracing::error;

use crate::{app_state::AppState, repositories::user_repository::UserRepository};

#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

pub async fn login(
    State(app_state): State<AppState>,
    Extension(repository): Extension<UserRepository>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    return match repository.log_user(&payload, &app_state.jwt_secret).await {
        Err(e) => {
            error!("Error: {:#?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
        }
        Ok(token) => (StatusCode::OK, Json(token)).into_response(),
    };
}
