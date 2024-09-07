use crate::{
    errors::NoteError, repositories::note_repository::NoteRepository, utils::jwt::TokenExtractor,
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
use tracing_subscriber::registry::Extensions;

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
    let decoded_token = match headers.extract_and_decode_token() {
        Ok(token) => token,
        Err((status, err)) => return (status, err).into_response(),
    };

    let id = match repository.new_note(&payload, &decoded_token.id).await {
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
    let decoded_token = match headers.extract_and_decode_token() {
        Ok(token) => token,
        Err((status, err)) => return (status, err).into_response(),
    };

    match repository.delete_note(&decoded_token.id, id).await {
        Ok(_) => (StatusCode::OK).into_response(),
        Err(e) => match e {
            NoteError::NoteNotFound(_) => (StatusCode::NOT_FOUND, e.to_string()).into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong").into_response(),
        },
    }
}

#[derive(Serialize, Deserialize)]
pub struct UpdateNoteRequest {
    pub title: Option<String>,
    pub colour: ColourOption,
}

pub async fn update_note(
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Extension(repository): Extension<NoteRepository>,
    Json(payload): Json<UpdateNoteRequest>,
) -> impl IntoResponse {
    let decoded_token = match headers.extract_and_decode_token() {
        Ok(token) => token,
        Err((status, err)) => return (status, err).into_response(),
    };

    match repository.edit_note(&decoded_token.id, id, payload).await {
        Ok(_) => (StatusCode::NO_CONTENT).into_response(),
        Err(e) => match e {
            NoteError::NoteNotFound(_) => (StatusCode::NOT_FOUND, e.to_string()).into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong").into_response(),
        },
    }
}
