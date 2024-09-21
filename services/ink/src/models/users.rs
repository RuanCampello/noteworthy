use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Clone, Debug, PartialEq, Eq, FromRow)]
pub struct User {
  pub id: String,
  pub name: Option<String>,
  pub email: Option<String>,
  #[sqlx(rename = "emailVerified")]
  pub email_verified: Option<NaiveDateTime>,
  pub password: Option<String>,
  pub image: Option<String>,
}

#[derive(FromRow)]
pub struct SimpleUser {
  pub id: String,
  pub name: String,
  pub image: Option<String>,
  pub email: String,
}
