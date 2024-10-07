use ink::{serve, EnvVariables};
use shuttle_runtime::SecretStore;

#[shuttle_runtime::main]
async fn main(#[shuttle_runtime::Secrets] secrets: SecretStore) -> shuttle_axum::ShuttleAxum {
  let env = EnvVariables::from_env(secrets);

  tracing_subscriber::fmt()
    .with_max_level(tracing::Level::DEBUG)
    .init();

  serve(env).await
}
