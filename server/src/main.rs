use axum::{
    http::{header, Method},
    routing::post,
    Extension, Router,
};
use controllers::note_controller::create_note;
use repositories::note_repository;
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
    let state = app_state::AppState::new().await?;
    let note_repository = note_repository::NoteRepository::new(Arc::new(state.database.clone()));
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        .allow_methods(Method::GET);

    let router = Router::new()
        .route("/notes", post(create_note))
        .layer(Extension(note_repository))
        .with_state(state)
        .layer(cors);

    let tcp_listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await?;

    axum::serve(tcp_listener, router).await?;
    Ok(())
}
