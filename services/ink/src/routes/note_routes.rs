use std::sync::Arc;

use axum::{
  routing::{delete, get, patch, post},
  Extension, Router,
};

use crate::{
  controllers::note_controller::{
    count_archived_notes, count_favourite_notes, count_notes, create_generated_note, create_note,
    delete_note, get_all_archive_notes, get_all_favourite_notes, get_all_notes, get_note,
    get_note_public_state, search_notes, update_note, update_note_archived_status,
    update_note_content, update_note_favourite_status, update_note_public_status,
  },
  repositories::note_repository::NoteRepository,
};
use sqlx::postgres::PgPool;

pub fn note_routes(db: &Arc<PgPool>) -> Router {
  let note_repository = NoteRepository::new(db);

  let single_note_route = Router::new()
    .route("/:id", delete(delete_note).patch(update_note).get(get_note))
    .route("/:id/favourite", patch(update_note_favourite_status))
    .route("/:id/archive", patch(update_note_archived_status))
    .route(
      "/:id/public",
      patch(update_note_public_status).get(get_note_public_state),
    )
    .route("/:id/content", patch(update_note_content));

  let notes_route = Router::new()
    .route("/", post(create_note).get(get_all_notes))
    .route("/count", get(count_notes))
    .route("/generate", post(create_generated_note))
    .route("/favourites", get(get_all_favourite_notes))
    .route("/favourites/count", get(count_favourite_notes))
    .route("/archived", get(get_all_archive_notes))
    .route("/archived/count", get(count_archived_notes))
    .route("/search", get(search_notes));

  Router::new()
    .nest("/notes", notes_route.merge(single_note_route))
    .layer(Extension(note_repository))
}
