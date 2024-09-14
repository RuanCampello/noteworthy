use chrono::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct User {
  pub id: String,
  pub name: Option<String>,
  pub email: Option<String>,
  pub email_verified: Option<NaiveDateTime>,
  pub password: Option<String>,
  pub image: Option<String>,
}
