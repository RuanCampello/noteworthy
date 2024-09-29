use crate::app_state::{AppState, EnvVariables};
use shuttle_runtime::SecretStore;

mod api;
mod app_state;
mod errors;
mod models;
mod utils;

#[shuttle_runtime::main]
async fn main(#[shuttle_runtime::Secrets] secrets: SecretStore) -> shuttle_axum::ShuttleAxum {
  let env = EnvVariables::from_env(secrets);

  api::serve(env).await
}
