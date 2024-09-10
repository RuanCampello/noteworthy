use app_state::AppState;
use axum::{
    http::{header, Method},
    routing::{delete, get, patch, post},
    Extension, Router,
};
use controllers::{
    note_controller::{
        create_note, delete_note, get_all_notes, get_note, update_note, update_note_content,
    },
    user_controller::{get_user_from_email, login, refresh_handler, register},
};
use repositories::{note_repository::NoteRepository, user_repository::UserRepository};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;

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
    let user_repository = UserRepository::new(database);

    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        .allow_methods(Method::GET);

    let single_note_route = Router::new()
        .route("/:id", delete(delete_note).patch(update_note).get(get_note))
        .route("/:id/content", patch(update_note_content));

    let router = Router::new()
        .route("/notes", post(create_note).get(get_all_notes))
        .nest("/notes", single_note_route)
        .layer(Extension(note_repository))
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/users/:email", get(get_user_from_email))
        .layer(Extension(user_repository))
        .route("/refresh-token/:old_token", get(refresh_handler))
        .with_state(state)
        .layer(cors);

    let tcp_listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await?;

    axum::serve(tcp_listener, router).await?;
    Ok(())
}
