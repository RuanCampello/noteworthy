use anyhow::bail;
use dotenv;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::{borrow::Cow, time::Duration};

#[derive(Clone, Debug)]
pub struct EnvVariables {
    pub database_url: Cow<'static, str>,
    pub jwt_secret: Cow<'static, str>,
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
                Ok(url) => url.into(),
                Err(err) => bail!("AUTH_SECRET must be set: {err}"),
            },
        })
    }
}

#[derive(Clone)]
pub struct AppState {
    pub database: DatabaseConnection,
    pub jwt_secret: String,
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        let env = EnvVariables::from_env()?;

        let mut opt = ConnectOptions::new(env.database_url.to_owned());
        opt.max_connections(80)
            .connect_timeout(Duration::from_secs(60))
            .idle_timeout(Duration::from_secs(60))
            .max_lifetime(Duration::from_secs(200))
            .sqlx_logging(true);

        let db = Database::connect(opt).await?;

        Ok(Self {
            database: db,
            jwt_secret: env.jwt_secret.to_string(),
        })
    }
}
