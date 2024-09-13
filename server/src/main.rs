use app_state::AppState;
use axum::{
    http::{header, Method},
    routing::get,
    Router,
};
use controllers::user_controller::refresh_handler;
use routes::{note_routes::note_routes, user_routes::user_routes};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

mod app_state;
mod controllers;
mod errors;
mod models;
mod repositories;
mod routes;
mod utils;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  let state = AppState::new().await?;
  let database = Arc::new(state.database.to_owned());
  let r2 = Arc::new(state.r2.to_owned());

  tracing_subscriber::fmt::init();

  let cors = CorsLayer::new()
      .allow_origin(Any)
      .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
      .allow_methods(Method::GET);

  let router = Router::new()
      .merge(note_routes(&database))
      .merge(user_routes(&database, &r2))
      .route("/refresh-token/:old_token", get(refresh_handler))
      .layer(cors);

  let tcp_listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await?;

  axum::serve(tcp_listener, router).await?;
  Ok(())
}
