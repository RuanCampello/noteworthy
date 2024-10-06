use crate::errors::CacheError;
use axum::async_trait;
use deadpool_redis::{Connection, Pool};
use redis::{AsyncCommands, RedisError};
use serde::de::DeserializeOwned;
use tracing::error;

#[derive(Clone)]
pub struct CacheManager {
  pub pool: Pool,
}

impl CacheManager {
  pub fn new(pool: Pool) -> Self {
    Self { pool }
  }
}

#[async_trait]
pub trait Cache {
  async fn get_connection(&self) -> Result<Connection, RedisError>;
  async fn get<T>(&self, key: &str) -> Result<Option<T>, CacheError>
  where
    T: DeserializeOwned;
  async fn set(&self, key: &str, value: &str, ttl: u64) -> Result<(), CacheError>;
}

#[async_trait]
impl Cache for CacheManager {
  async fn get_connection(&self) -> Result<Connection, RedisError> {
    let conn = match self.pool.get().await {
      Ok(conn) => conn,
      Err(e) => {
        error!("Failed to get connection from pool: {}", e);

        return Err(RedisError::from((
          redis::ErrorKind::IoError,
          "Failed to get connection from pool",
        )));
      }
    };

    Ok(conn)
  }

  async fn get<T>(&self, key: &str) -> Result<Option<T>, CacheError>
  where
    T: DeserializeOwned,
  {
    let mut conn = self.get_connection().await?;
    let value: Option<String> = conn.get(key).await?;

    match value {
      Some(v) => {
        let result: Result<T, _> = serde_json::from_str::<T>(&v);
        match result {
          Ok(deserialized_value) => Ok(Some(deserialized_value)),
          Err(e) => Err(CacheError::Deserialize(e)),
        }
      }
      None => Ok(None),
    }
  }

  async fn set(&self, key: &str, value: &str, ttl: u64) -> Result<(), CacheError> {
    let mut conn = self.get_connection().await?;
    conn.set_ex(key, value, ttl).await?;

    Ok(())
  }
}
