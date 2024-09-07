use crate::{
    errors::NoteError,
    repositories::note_repository::NoteRepository,
    utils::jwt::{JwtDecoder, TokenExtractor},
};
use axum::{
    extract::Path,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    Extension, Json,
};
use sea_orm::prelude::Uuid;
use serde::{Deserialize, Serialize};
use tracing::{error, info};

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum ColourOption {
    Colour(String),
}

#[derive(Serialize, Deserialize)]
pub struct CreateNoteRequest {
    pub title: String,
    pub content: Option<String>,
    pub colour: ColourOption,
}

pub async fn create_note(
    headers: HeaderMap,
    Extension(repository): Extension<NoteRepository>,
    Json(payload): Json<CreateNoteRequest>,
) -> impl IntoResponse {
    let token = match headers.extract_bearer_token() {
        Ok(token) => token.decode_jwt().unwrap(),
        Err(e) => return (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    };

    let id = match repository.new_note(&payload, &token.claims.id).await {
        Ok(id) => id,
        Err(e) => {
            error!("Something went wrong: {:#?}", e);
            match e {
                NoteError::NoteOwnerNotFound(_) => {
                    return (StatusCode::NOT_FOUND, e.to_string()).into_response()
                }
                _ => {
                    return (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong")
                        .into_response()
                }
            }
        }
    };

    (StatusCode::CREATED, Json(id)).into_response()
}

pub async fn delete_note(
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
    let token = match headers.extract_bearer_token() {
        Ok(token) => token,
        Err(e) => return (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    };

    let decoded_token = match token.decode_jwt() {
        Ok(decoded_token) => decoded_token,
        Err(e) => return (StatusCode::UNAUTHORIZED, e.to_string()).into_response(),
    };
    info!("Decoded Token: {:#?}", decoded_token.claims.exp);

    match repository.delete_note(&decoded_token.claims.id, id).await {
        Ok(_) => (StatusCode::OK).into_response(),
        Err(e) => match e {
            NoteError::NoteNotFound(_) => (StatusCode::NOT_FOUND, e.to_string()).into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong").into_response(),
        },
    }
}
