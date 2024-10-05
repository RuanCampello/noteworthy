use super::notes::NoteFormat;
use serde::Serialize;
use sqlx::FromRow;
use ts_rs::TS;

#[derive(Clone, Debug, PartialEq, Eq, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct UserPreferences {
  pub note_format: NoteFormat,
  pub full_note: bool,
}
