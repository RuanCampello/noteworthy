use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Clone, Debug, PartialEq, Eq, FromRow)]
pub struct PasswordResetToken {
  pub id: String,
  pub email: String,
  pub token: String,
  pub expires: NaiveDateTime,
}
