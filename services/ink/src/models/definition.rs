use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "Definition.ts", rename_all = "camelCase")]
pub struct Definition {
  pub word: String,
  pub phonetic: Option<String>,
  pub phonetics: Vec<Phonetic>,
  pub meanings: Vec<Meaning>,
  pub license: License,
  #[serde(rename = "sourceUrls")]
  pub source_urls: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export_to = "Definition.ts")]
pub struct Phonetic {
  pub text: Option<String>,
  pub audio: String,
  #[serde(rename = "sourceUrl")]
  pub source_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export_to = "Definition.ts")]
pub struct Meaning {
  #[serde(rename = "partOfSpeech")]
  pub part_of_speech: String,
  pub definitions: Vec<DefinitionEntry>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export_to = "Definition.ts")]
pub struct DefinitionEntry {
  pub definition: String,
  pub synonyms: Vec<String>,
  pub antonyms: Vec<String>,
  pub example: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export_to = "Definition.ts")]
pub struct License {
  pub name: String,
  pub url: String,
}
