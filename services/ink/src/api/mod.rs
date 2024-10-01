use crate::app_state::{AppState, EnvVariables};
use axum::{
  http::{header, Method},
  Extension, Router,
};
use tower_http::cors::{Any, CorsLayer};

mod notes;
mod users;

pub async fn serve(env: EnvVariables) -> shuttle_axum::ShuttleAxum {
  let app_state = AppState::new(&env)
    .await
    .expect("Failed to create app state");

  let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
    .allow_methods(Method::GET);

  let router = Router::new()
    .merge(users::http::router())
    .merge(notes::http::router())
    .layer(Extension(app_state))
    .layer(cors);

  Ok(router.into())
}
