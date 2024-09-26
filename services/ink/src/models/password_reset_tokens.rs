use chrono::NaiveDateTime;
use serde::Serialize;
use sqlx::FromRow;

#[derive(Clone, Debug, PartialEq, Eq, FromRow, Serialize)]
pub struct PasswordResetToken {
  pub id: i32,
  pub email: String,
  pub token: String,
  pub expires: NaiveDateTime,
  #[sqlx(skip)]
  #[serde(skip)]
  pub is_new: bool,
}
