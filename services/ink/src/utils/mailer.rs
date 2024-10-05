use crate::utils::constants::RESET_EMAIL;
use resend_rs::{types::CreateEmailBaseOptions, Error, Resend};

/*
  Mailer is a wrapper around the Resend API.
  It provides a simple interface to send emails using the Resend API.
*/

#[derive(Clone)]
pub struct Mailer {
  client: Resend,
  domain: String,
  hostname: String,
}

impl Mailer {
  pub fn new(api_key: &str, domain: &str, hostname: &str) -> Self {
    Self {
      client: Resend::new(api_key),
      domain: domain.to_string(),
      hostname: hostname.to_string(),
    }
  }

  pub async fn send_user_confirmation_email(&self, token: &str, to: &str) -> Result<(), Error> {
    let from = format!("Noteworthy <onboarding@{}>", self.domain);
    let reset_link = format!("{}/new-password?token={}", self.hostname, token);
    let subject = "Reset your password.";
    let html = RESET_EMAIL.replace("{reset_link}", &reset_link);

    let email = CreateEmailBaseOptions::new(from, [to], subject).with_html(&html);

    match self.client.emails.send(email).await {
      Ok(email) => {
        tracing::info!("EMAIL SENT {}", &email.id);
        Ok(())
      }
      Err(e) => {
        tracing::error!("Error sending email: {}", e);
        Err(e)
      }
    }
  }
}
