use axum::{
    http::{header, Method},
    routing::get,
    Router,
};
use tower_http::cors::{Any, CorsLayer};

mod app_state;
mod models;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let state = app_state::AppState::new().await?;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        .allow_methods(Method::GET);

    let router = Router::new()
        .route("/", get(hello_world))
        .with_state(state)
        .layer(cors);
    let tcp_listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await?;

    axum::serve(tcp_listener, router).await?;
    Ok(())
}

async fn hello_world() -> &'static str {
    "Hello, World!"
}
