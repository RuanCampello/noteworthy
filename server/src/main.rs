use crate::app_state::{AppState, EnvVariables};
use crate::utils::jwt::JwtManager;
use axum::{
  http::{header, Method},
  routing::get,
  Extension, Router,
};
use controllers::user_controller::refresh_handler;
use routes::{note_routes::note_routes, user_routes::user_routes};
use shuttle_runtime::SecretStore;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

mod app_state;
mod controllers;
mod errors;
mod models;
mod repositories;
mod routes;
mod utils;

#[shuttle_runtime::main]
async fn main(#[shuttle_runtime::Secrets] secrets: SecretStore) -> shuttle_axum::ShuttleAxum {
  let env = EnvVariables::from_env(secrets);
  let state = AppState::new(&env).await?;
  let jwt_manager = JwtManager::new(env.jwt_secret);
  let database = Arc::new(state.database.to_owned());
  let r2 = Arc::new(state.r2.to_owned());

  let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
    .allow_methods(Method::GET);

  let router = Router::new()
    .merge(note_routes(&database))
    .merge(user_routes(&database, &r2))
    .route("/refresh-token/:old_token", get(refresh_handler))
    .layer(Extension(jwt_manager))
    .layer(cors);

  Ok(router.into())
}
