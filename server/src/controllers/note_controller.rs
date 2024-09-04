use crate::repositories::note_repository::{ColourOption, NoteRepository};
use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use tracing::error;

#[derive(Serialize, Deserialize)]
pub struct CreateNoteRequest {
    user_id: String,
    title: String,
    content: Option<String>,
    colour: ColourOption,
}

pub async fn create_note(
    Extension(repository): Extension<NoteRepository>,
    Json(payload): Json<CreateNoteRequest>,
) -> impl IntoResponse {
    let id = match repository
        .new_note(
            payload.user_id,
            payload.title,
            payload.content,
            payload.colour,
        )
        .await
    {
        Ok(id) => id,
        Err(e) => {
            error!("Something went wrong: {:#?}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong!").into_response();
        }
    };

    (StatusCode::CREATED, Json(id)).into_response()
}
