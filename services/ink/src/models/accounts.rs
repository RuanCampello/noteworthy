#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Account {
  pub user_id: String,
  pub r#type: String,
  pub provider: String,
  pub provider_account_id: String,
  pub refresh_token: Option<String>,
  pub access_token: Option<String>,
  pub expires_at: Option<i32>,
  pub token_type: Option<String>,
  pub scope: Option<String>,
  pub id_token: Option<String>,
  pub session_state: Option<String>,
}
