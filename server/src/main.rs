use app_state::AppState;
use axum::{
    http::{header, Method},
    middleware,
    routing::{delete, get, post},
    Extension, Router,
};
use controllers::{
    note_controller::{create_note, delete_note, update_note},
    user_controller::login,
};
use repositories::{note_repository::NoteRepository, user_repository::UserRepository};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use utils::{jwt::refresh_handler, middleware::private_route};

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

    let router = Router::new()
        .route("/notes", post(create_note))
        .route("/notes/:id", delete(delete_note).patch(update_note))
        .layer(Extension(note_repository))
        .route_layer(middleware::from_fn(private_route))
        .route("/login", post(login))
        .layer(Extension(user_repository))
        .route("/refresh-token/:old_token", get(refresh_handler))
        .with_state(state)
        .layer(cors);

    let tcp_listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await?;

    axum::serve(tcp_listener, router).await?;
    Ok(())
}
