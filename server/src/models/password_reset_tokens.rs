use chrono::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PasswordResetToken {
  pub id: String,
  pub email: String,
  pub token: String,
  pub expires: NaiveDateTime,
}
