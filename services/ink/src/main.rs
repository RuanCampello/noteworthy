use ink::router;

#[tokio::main]
async fn main() {
  let app = router().await.expect("Failed to create router");

  let listener = tokio::net::TcpListener::bind("0.0.0.0:6969").await.unwrap();
  axum::serve(listener, app).await.unwrap();
}
