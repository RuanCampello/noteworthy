use anyhow::bail;
use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::{
  config::{Credentials, SharedCredentialsProvider},
  Client,
};
use dotenv;
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::{borrow::Cow, time::Duration};

#[derive(Clone, Debug)]
pub struct EnvVariables {
  pub database_url: Cow<'static, str>,
  pub jwt_secret: Cow<'static, str>,
  pub cloudflare_account_id: Cow<'static, str>,
  pub access_key_id: Cow<'static, str>,
  pub secret_access_key: Cow<'static, str>,
}

impl EnvVariables {
  pub fn from_env() -> anyhow::Result<Self> {
    dotenv::from_path("../.env").ok();

    Ok(Self {
      database_url: match dotenv::var("DATABASE_URL") {
        Ok(url) => url.into(),
        Err(err) => bail!("DATABASE_URL must be set: {err}"),
      },
      jwt_secret: match dotenv::var("AUTH_SECRET") {
        Ok(secret) => secret.into(),
        Err(err) => bail!("AUTH_SECRET must be set: {err}"),
      },
      cloudflare_account_id: match dotenv::var("CLOUDFLARE_ACCOUNT_ID") {
        Ok(account_id) => account_id.into(),
        Err(err) => bail!("CLOUDFLARE_ACCOUNT_ID must be set: {err}"),
      },
      access_key_id: match dotenv::var("CLOUDFLARE_ACCESS_KEY") {
        Ok(access_key) => access_key.into(),
        Err(err) => bail!("CLOUDFLARE_ACCESS_KEY must be set: {err}"),
      },
      secret_access_key: match dotenv::var("CLOUDFLARE_SECRET_KEY") {
        Ok(secret_access) => secret_access.into(),
        Err(err) => bail!("CLOUDFLARE_SECRET_KEY must be set: {err}"),
      },
    })
  }
}

#[derive(Clone)]
pub struct AppState {
  pub database: PgPool,
  pub r2: Client,
}

impl AppState {
  pub async fn new() -> anyhow::Result<Self> {
    let env = EnvVariables::from_env()?;

    let endpoint = format!(
      "https://{}.r2.cloudflarestorage.com",
      env.cloudflare_account_id
    );

    let credentials = Credentials::new(
      env.access_key_id.to_string(),
      env.secret_access_key.to_string(),
      None,
      None,
      "custom",
    );
    let shared_cred = SharedCredentialsProvider::new(credentials);

    let s3_config = aws_config::load_defaults(BehaviorVersion::v2024_03_28())
      .await
      .into_builder()
      .credentials_provider(shared_cred)
      .endpoint_url(endpoint)
      .region(Region::new("us-east-1"))
      .build();

    let r2 = aws_sdk_s3::Client::new(&s3_config);

    let pool = PgPoolOptions::new()
      .max_connections(80)
      .max_lifetime(Duration::from_secs(200))
      .connect(&env.database_url)
      .await?;

    Ok(Self { database: pool, r2 })
  }
}
