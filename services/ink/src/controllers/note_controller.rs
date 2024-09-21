use crate::models::enums::SearchFilter;
use crate::{repositories::note_repository::NoteRepository, utils::middleware::AuthUser};
use aws_sdk_s3::config::IntoShared;
use axum::extract::Query;
use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use serde::Deserialize;
use tracing::error;
use uuid::Uuid;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct CreateNoteRequest {
  #[validate(length(min = 4))]
  pub title: String,
  pub content: Option<String>,
  pub colour: String,
}

pub async fn create_note(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
  Json(payload): Json<CreateNoteRequest>,
) -> impl IntoResponse {
  let id = match repository.new_note(&payload, &user.id).await {
    Ok(id) => id,
    Err(e) => return e.into_response(),
  };

  (StatusCode::CREATED, Json(id)).into_response()
}

pub async fn create_generated_note(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  let id = match repository.generate_note(&user.id).await {
    Ok(id) => id,
    Err(e) => return e.into_response(),
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

#[derive(Deserialize, Validate)]
pub struct UpdateNoteRequest {
  #[validate(length(min = 4))]
  pub title: Option<String>,
  pub colour: String,
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
  match repository.toggle_note_archived(id, &user.id).await {
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
    Err(e) => {
      error!("get_note error {:#?}", e);
      StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
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

#[derive(Deserialize)]
pub struct SearchParams {
  pub q: String,
  pub filter: Option<SearchFilter>,
}

pub async fn search_notes(
  AuthUser(user): AuthUser,
  Query(params): Query<SearchParams>,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.search_notes(&user.id, params).await {
    Ok(notes) => (StatusCode::OK, Json(notes)).into_response(),
    Err(e) => {
      error!("error searching notes {:?}", e);
      e.into_response()
    }
  }
}

pub async fn count_notes(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.count_user_notes(&user.id, false, false).await {
    Ok(count) => (StatusCode::OK, Json(count)).into_response(),
    Err(e) => {
      error!("error on count {:?}", e);
      e.into_response()
    }
  }
}

pub async fn count_favourite_notes(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.count_user_notes(&user.id, true, false).await {
    Ok(count) => (StatusCode::OK, Json(count)).into_response(),
    Err(e) => {
      error!("error on count {:?}", e);
      e.into_response()
    }
  }
}

pub async fn count_archived_notes(
  AuthUser(user): AuthUser,
  Extension(repository): Extension<NoteRepository>,
) -> impl IntoResponse {
  match repository.count_user_notes(&user.id, false, true).await {
    Ok(count) => (StatusCode::OK, Json(count)).into_response(),
    Err(e) => {
      error!("error on count {:?}", e);
      e.into_response()
    }
  }
}
