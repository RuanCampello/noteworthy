use crate::app_state::AppState;
use crate::utils::mailer::Mailer;
use axum::{
  http::{header, Method},
  Extension, Router,
};
use tower_http::cors::{Any, CorsLayer};

mod dictionary;
mod notes;
mod users;

pub async fn router() -> Result<Router, Box<dyn std::error::Error>> {
  tracing_subscriber::fmt::init();
  
  let app_state = AppState::new().await.expect("Failed to create app state");
  let mailer = Mailer::default();

  let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
    .allow_methods(Method::GET);

  let router = Router::new()
    .merge(users::router())
    .merge(notes::router())
    .merge(dictionary::router())
    .layer(Extension(app_state))
    .layer(Extension(mailer))
    .layer(cors);

  Ok(router)
}
