use crate::utils::jwt::JwtManager;
use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::{
  config::{Credentials, SharedCredentialsProvider},
  Client,
};
use deadpool_redis::{Config, Pool, Runtime};
use shuttle_runtime::SecretStore;
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::error;
use std::time::Duration;

#[derive(Clone, Debug)]
pub struct EnvVariables {
  pub database_url: String,
  pub jwt_secret: String,
  pub cloudflare_account_id: String,
  pub access_key_id: String,
  pub secret_access_key: String,
  pub resend_api_key: String,
  pub resend_domain: String,
  pub redis_url: String,
  pub hostname: String,
}

impl EnvVariables {
  pub fn from_env(secrets: SecretStore) -> Self {
    let database_url = secrets
      .get("DATABASE_URL")
      .expect("DATABASE_URL must be set");
    let jwt_secret = secrets.get("AUTH_SECRET").expect("AUTH_SECRET must be set");
    let cloudflare_account_id = secrets
      .get("CLOUDFLARE_ACCOUNT_ID")
      .expect("CLOUDFLARE_ACCOUNT_ID must be set");
    let access_key_id = secrets
      .get("CLOUDFLARE_ACCESS_KEY")
      .expect("CLOUDFLARE_ACCESS_KEY must be set");
    let secret_access_key = secrets
      .get("CLOUDFLARE_SECRET_KEY")
      .expect("CLOUDFLARE_SECRET_KEY must be set");
    let resend_api_key = secrets
      .get("RESEND_API_KEY")
      .expect("RESEND_API_KEY must be set");
    let resend_domain = secrets
      .get("RESEND_DOMAIN")
      .expect("RESEND_DOMAIN must be set");
    let redis_url = secrets.get("REDIS_URL").expect("REDIS_URL must be set");
    let hostname = secrets.get("HOSTNAME").expect("HOSTNAME must be set");

    Self {
      database_url,
      jwt_secret,
      cloudflare_account_id,
      access_key_id,
      secret_access_key,
      resend_api_key,
      resend_domain,
      redis_url,
      hostname,
    }
  }
}

#[derive(Clone)]
pub struct AppState {
  pub database: PgPool,
  pub r2: Client,
  pub jwt_manager: JwtManager,
  pub redis: Pool,
}

impl AppState {
  pub async fn new(env: &EnvVariables) -> Result<Self, Box<dyn error::Error>> {
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

    let r2 = Client::new(&s3_config);

    let pool = PgPoolOptions::new()
      .max_connections(20)
      .max_lifetime(Duration::from_secs(120))
      .idle_timeout(Duration::from_secs(120))
      .acquire_timeout(Duration::from_secs(15))
      .connect(&env.database_url)
      .await?;

    let jwt_manager = JwtManager::new(&env.jwt_secret);

    let redis_pool = Config::from_url(&env.redis_url)
      .create_pool(Some(Runtime::Tokio1))
      .expect("Failed to create Redis connection pool");

    Ok(Self {
      database: pool,
      r2,
      jwt_manager,
      redis: redis_pool,
    })
  }
}
