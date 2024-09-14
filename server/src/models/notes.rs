use super::sea_orm_active_enums::Colour;
use chrono::NaiveDateTime;
use sea_orm::{entity::prelude::*, FromQueryResult};
use serde::{Deserialize, Serialize};
use sqlx::{Decode, FromRow};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Note {
  pub id: Uuid,
  pub title: String,
  pub content: String,
  pub colour: Colour,
  #[serde(rename = "userId")]
  pub user_id: String,
  pub created_at: NaiveDateTime,
  pub is_archived: bool,
  pub is_favourite: bool,
  pub is_public: bool,
  pub last_update: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, FromRow, TS)]
#[ts(export, rename = "Note")]
#[serde(rename_all = "camelCase")]
pub struct NoteWithUserPrefs {
  #[ts(type = "string")]
  pub id: Uuid,
  pub title: String,
  pub content: String,
  pub colour: String,
  #[serde(rename = "userId")]
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
  pub note_format: String,
}

#[derive(Debug, Serialize, FromRow, TS)]
#[ts(export, rename = "PartialNote")]
#[serde(rename_all = "camelCase")]
pub struct PartialNote {
  #[ts(type = "string")]
  pub id: Uuid,
  pub title: String,
  pub content: String,
  #[ts(type = "string")]
  pub colour: Colour,
  #[ts(type = "string")]
  pub created_at: NaiveDateTime,
}
