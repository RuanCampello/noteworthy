use crate::{
    errors::NoteError, repositories::note_repository::NoteRepository, utils::middleware::AuthUser,
};
use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use sea_orm::prelude::Uuid;
use serde::{Deserialize, Serialize};
use tracing::error;

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
    AuthUser(user): AuthUser,
    Extension(repository): Extension<NoteRepository>,
    Json(payload): Json<CreateNoteRequest>,
) -> impl IntoResponse {
    let id = match repository.new_note(&payload, &user.id).await {
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
    AuthUser(user): AuthUser,
    Path(id): Path<Uuid>,
    Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
    match repository.delete_note(&user.id, id).await {
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
    AuthUser(user): AuthUser,
    Path(id): Path<Uuid>,
    Extension(repository): Extension<NoteRepository>,
    Json(payload): Json<UpdateNoteRequest>,
) -> impl IntoResponse {
    match repository.edit_note(&user.id, id, payload).await {
        Ok(_) => (StatusCode::NO_CONTENT).into_response(),
        Err(e) => match e {
            NoteError::NoteNotFound(_) => (StatusCode::NOT_FOUND, e.to_string()).into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong").into_response(),
        },
    }
}

pub async fn get_note(
    Path(id): Path<Uuid>,
    AuthUser(user): AuthUser,
    Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
    return match repository.find_note_by_id(&user.id, id).await {
        Ok(note) => (StatusCode::OK, Json(note)).into_response(),
        Err(e) => {
            error!("Error on find_note {:#?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR).into_response()
        }
    };
}

pub async fn get_all_notes(
    AuthUser(user): AuthUser,
    Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
    return match repository.find_all_user_notes(&user.id).await {
        Ok(note) => (StatusCode::OK, Json(note)).into_response(),
        Err(_) => (StatusCode::NOT_FOUND).into_response(),
    };
}
