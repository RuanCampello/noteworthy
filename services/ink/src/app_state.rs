use crate::utils::cache::CacheManager;
use crate::utils::jwt::JwtManager;
use crate::utils::r2::R2;
use deadpool_redis::{Config, Runtime};
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
  pub fn from_env() -> Self {
    dotenv::dotenv().ok();

    let database_url = dotenv::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let jwt_secret = dotenv::var("AUTH_SECRET").expect("AUTH_SECRET must be set");
    let cloudflare_account_id =
      dotenv::var("CLOUDFLARE_ACCOUNT_ID").expect("CLOUDFLARE_ACCOUNT_ID must be set");
    let access_key_id =
      dotenv::var("CLOUDFLARE_ACCESS_KEY").expect("CLOUDFLARE_ACCESS_KEY must be set");
    let secret_access_key =
      dotenv::var("CLOUDFLARE_SECRET_KEY").expect("CLOUDFLARE_SECRET_KEY must be set");
    let resend_api_key = dotenv::var("RESEND_API_KEY").expect("RESEND_API_KEY must be set");
    let resend_domain = dotenv::var("RESEND_DOMAIN").expect("RESEND_DOMAIN must be set");
    let redis_url = dotenv::var("REDIS_URL").expect("REDIS_URL must be set");
    let hostname = dotenv::var("HOSTNAME").expect("HOSTNAME must be set");

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
  pub r2: R2,
  pub jwt_manager: JwtManager,
  pub cache: CacheManager,
}

impl AppState {
  pub(super) async fn new() -> Result<Self, Box<dyn error::Error>> {
    let env = EnvVariables::from_env();

    let pool = PgPoolOptions::new()
      .max_connections(20)
      .max_lifetime(Duration::from_secs(120))
      .idle_timeout(Duration::from_secs(120))
      .acquire_timeout(Duration::from_secs(15))
      .connect(&env.database_url)
      .await?;

    let jwt_manager = JwtManager::new(&env.jwt_secret);

    let r2 = R2::new(
      &env.cloudflare_account_id,
      env.access_key_id.to_string(),
      env.secret_access_key.to_string(),
    )
    .await;

    let redis_pool = Config::from_url(&env.redis_url)
      .create_pool(Some(Runtime::Tokio1))
      .expect("Failed to create Redis connection pool");
    let cache = CacheManager::new(redis_pool);

    Ok(Self {
      database: pool,
      r2,
      jwt_manager,
      cache,
    })
  }
}
