use crate::{
  errors::NoteError, repositories::note_repository::NoteRepository, utils::middleware::AuthUser,
};
use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use tracing::{error, info};

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum ColourOption {
  Colour(String),
}

#[derive(Deserialize)]
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
      return e.into_response();
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
    Ok(_) => StatusCode::OK.into_response(),
    Err(e) => e.into_response(),
  }
}

#[derive(Deserialize)]
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
    Ok(_) => StatusCode::NO_CONTENT.into_response(),
    Err(e) => e.into_response(),
  }
}

#[derive(Deserialize)]
pub struct UpdateNoteContentRequest {
  content: String,
}

pub async fn update_note_content(
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
  Extension(repository): Extension<NoteRepository>,
  Json(payload): Json<UpdateNoteContentRequest>,
) -> impl IntoResponse {
  match repository
    .edit_note_content(id, &user.id, payload.content)
    .await
  {
    Ok(_) => StatusCode::NO_CONTENT.into_response(),
    Err(e) => e.into_response(),
  }
}

pub async fn update_note_favourite_status(
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.toggle_note_favourite(id, &user.id).await {
    Ok(_) => StatusCode::OK.into_response(),
    Err(e) => e.into_response(),
  }
}
pub async fn update_note_archived_status(
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.toggle_note_favourite(id, &user.id).await {
    Ok(_) => StatusCode::OK.into_response(),
    Err(e) => e.into_response(),
  }
}
pub async fn update_note_public_status(
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.toggle_note_publicity(id, &user.id).await {
    Ok(_) => StatusCode::OK.into_response(),
    Err(e) => e.into_response(),
  }
}

pub async fn get_note(
  Path(id): Path<Uuid>,
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.find_note_by_id(&user.id, id).await {
    Ok(note) => (StatusCode::OK, Json(note)).into_response(),
    Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
  }
}

pub async fn get_all_notes(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.find_all_user_notes(&user.id, false, false).await {
    Ok(notes) => (StatusCode::OK, Json(notes)).into_response(),
    Err(e) => e.into_response(),
  }
}

pub async fn get_all_favourite_notes(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.find_all_user_notes(&user.id, true, false).await {
    Ok(notes) => (StatusCode::OK, Json(notes)).into_response(),
    Err(e) => e.into_response(),
  }
}

pub async fn get_all_archive_notes(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.find_all_user_notes(&user.id, false, true).await {
    Ok(notes) => (StatusCode::OK, Json(notes)).into_response(),
    Err(e) => e.into_response(),
  }
}
