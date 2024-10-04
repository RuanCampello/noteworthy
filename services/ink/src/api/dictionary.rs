use crate::errors::DictionaryError;
use crate::models::definition::Definition;
use axum::{Json, Router, routing::get, extract::Path};

pub fn router() -> Router {
  Router::new().route("/dictionary/:word", get(get_definition))
}

async fn get_definition(
  Path(word): Path<String>,
) -> Result<Json<Vec<Definition>>, DictionaryError> {
  let url = format!(
    "https://api.dictionaryapi.dev/api/v2/entries/{}/{}",
    "en", word
  );
  let response = reqwest::get(url).await?.json::<Vec<Definition>>().await?;

  Ok(Json(response))
}
