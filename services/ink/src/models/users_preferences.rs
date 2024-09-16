use super::enums::NoteFormat;
use serde::Serialize;

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
pub struct UserPreferences {
  pub id: i32,
  #[serde(rename = "userId")]
  pub user_id: String,
  pub note_format: NoteFormat,
  pub full_note: bool,
}
