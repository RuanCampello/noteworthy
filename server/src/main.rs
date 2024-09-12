use app_state::AppState;
use axum::{
    http::{header, Method},
    routing::{delete, get, patch, post},
    Extension, Router,
};
use controllers::{
    note_controller::{
        create_note, delete_note, get_all_archive_notes, get_all_favourite_notes, get_all_notes,
        get_note, update_note, update_note_content,
    },
    user_controller::{get_user_from_email, get_user_image, login, refresh_handler, register},
};
use repositories::{note_repository::NoteRepository, user_repository::UserRepository};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

mod app_state;
mod controllers;
mod errors;
mod models;
mod repositories;
mod utils;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let state = AppState::new().await?;
    let database = Arc::new(state.database.to_owned());

    let note_repository = NoteRepository::new(database.clone());
    let user_repository = UserRepository::new(database, Arc::new(state.r2.to_owned()));

    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        .allow_methods(Method::GET);

    let single_note_route = Router::new()
        .route("/:id", delete(delete_note).patch(update_note).get(get_note))
        .route("/:id/content", patch(update_note_content));

    let notes_route = Router::new()
        .route("/", post(create_note).get(get_all_notes))
        .route("/favourites", get(get_all_favourite_notes))
        .route("/archived", get(get_all_archive_notes));

    let router = Router::new()
        .nest("/notes", single_note_route)
        .nest("/notes", notes_route)
        .layer(Extension(note_repository))
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/users/:email", get(get_user_from_email))
        .route("/users/profile/:id", get(get_user_image))
        .layer(Extension(user_repository))
        .route("/refresh-token/:old_token", get(refresh_handler))
        .with_state(state)
        .layer(cors);

    let tcp_listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await?;

    axum::serve(tcp_listener, router).await?;
    Ok(())
}
