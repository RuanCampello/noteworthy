use chrono::NaiveDateTime;
use serde::Serialize;
use sqlx::FromRow;
use ts_rs::TS;

#[derive(Clone, Debug, PartialEq, Eq, FromRow, Serialize, TS)]
#[ts(export)]
pub struct PasswordResetToken {
  pub id: i32,
  pub email: String,
  pub token: String,
  #[ts(type = "string")]
  pub expires: NaiveDateTime,
  #[sqlx(skip)]
  #[serde(skip)]
  #[ts(skip)]
  pub is_new: bool,
}
