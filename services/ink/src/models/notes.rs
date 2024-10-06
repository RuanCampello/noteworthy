use crate::errors::NoteError;
use chrono::NaiveDateTime;
use rand::Rng;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::{FromRow, Type};
use std::fmt::Display;
use std::str::FromStr;
use ts_rs::TS;
use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, Eq, Serialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Note {
  pub id: Uuid,
  pub title: String,
  pub content: String,
  pub colour: Colour,
  pub user_id: String,
  pub created_at: NaiveDateTime,
  pub is_archived: bool,
  pub is_favourite: bool,
  pub is_public: bool,
  pub last_update: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[ts(export, rename = "Note", export_to = "Note.ts")]
#[serde(rename_all = "camelCase")]
pub struct NoteWithUserPrefs {
  #[ts(type = "string")]
  pub id: Uuid,
  pub title: String,
  pub content: String,
  pub colour: Colour,
  pub user_id: String,
  #[ts(type = "string")]
  pub created_at: NaiveDateTime,
  pub is_archived: bool,
  pub is_favourite: bool,
  pub is_public: bool,
  #[ts(type = "string")]
  pub last_update: NaiveDateTime,
  pub name: String,
  pub full_note: bool,
  pub note_format: NoteFormat,
}

#[derive(Deserialize)]
pub struct GeneratedNoteResponse {
  pub title: String,
  pub content: String,
}

#[derive(Deserialize, Serialize, FromRow, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
  #[ts(type = "string")]
  id: Uuid,
  title: String,
  content: String,
  highlighted_content: String,
}

#[derive(Debug, Serialize, FromRow, TS)]
#[ts(export, rename = "PartialNote", export_to = "Note.ts")]
#[serde(rename_all = "camelCase")]
pub struct PartialNote {
  #[ts(type = "string")]
  pub id: Uuid,
  pub title: String,
  pub content: String,
  pub colour: Colour,
  #[ts(type = "string")]
  pub created_at: NaiveDateTime,
}

#[derive(Deserialize, Debug, Clone, PartialEq, Eq, Type, TS)]
#[sqlx(rename_all = "lowercase", type_name = "colour")]
#[serde(rename_all = "lowercase")]
#[ts(export, export_to = "Enums.ts", rename_all = "lowercase")]
pub enum Colour {
  Blue,
  Cambridge,
  Melon,
  Mikado,
  Mindaro,
  Slate,
  Sunset,
  Tickle,
  Tiffany,
  Wisteria,
}
#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize, Deserialize, TS)]
#[sqlx(rename_all = "lowercase", type_name = "note_format")]
#[serde(rename_all = "lowercase")]
#[ts(export, export_to = "Enums.ts")]
pub enum NoteFormat {
  Full,
  Slim,
}

impl FromStr for Colour {
  type Err = NoteError;
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    let colour = match s.to_lowercase().as_str() {
      "blue" => Colour::Blue,
      "cambridge" => Colour::Cambridge,
      "melon" => Colour::Melon,
      "mikado" => Colour::Mikado,
      "mindaro" => Colour::Mindaro,
      "slate" => Colour::Slate,
      "sunset" => Colour::Sunset,
      "tickle" => Colour::Tickle,
      "tiffany" => Colour::Tiffany,
      "wisteria" => Colour::Wisteria,
      "random" => Colour::random(),
      _ => return Err(NoteError::InvalidColour(s.to_owned())),
    };
    Ok(colour)
  }
}

impl Display for Colour {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let str = match self {
      Colour::Blue => "blue",
      Colour::Cambridge => "cambridge",
      Colour::Melon => "melon",
      Colour::Mikado => "mikado",
      Colour::Mindaro => "mindaro",
      Colour::Slate => "slate",
      Colour::Sunset => "sunset",
      Colour::Tickle => "tickle",
      Colour::Tiffany => "tiffany",
      Colour::Wisteria => "wisteria",
    }
    .to_string();
    write!(f, "{}", str)
  }
}

impl Serialize for Colour {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(&self.to_string())
  }
}

pub trait RandomColour {
  fn random() -> Self;
}

const COLOURS: &[Colour] = &[
  Colour::Blue,
  Colour::Cambridge,
  Colour::Melon,
  Colour::Mikado,
  Colour::Mindaro,
  Colour::Slate,
  Colour::Sunset,
  Colour::Tickle,
  Colour::Tiffany,
  Colour::Wisteria,
];

impl RandomColour for Colour {
  fn random() -> Self {
    COLOURS[rand::thread_rng().gen_range(0..COLOURS.len())].clone()
  }
}
