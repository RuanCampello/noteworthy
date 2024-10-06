use std::time::Duration;
use axum::async_trait;
use deadpool_redis::{Connection, Pool};
use redis::{AsyncCommands, RedisError};
use tracing::error;

#[async_trait]
pub trait Cache {
  async fn get_connection(&self) -> Result<Connection, RedisError>;
  async fn get_value(&self, key: &str) -> Result<Option<String>, RedisError>;
  async fn set(&self, key: &str, value: &str, ttl: u64) -> Result<(), RedisError>;
}

#[async_trait]
impl Cache for Pool {
  async fn get_connection(&self) -> Result<Connection, RedisError> {
    let conn = match self.get().await {
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

  async fn get_value(&self, key: &str) -> Result<Option<String>, RedisError> {
    let mut conn = self.get_connection().await?;
    let value: Option<String> = conn.get(key).await?;

    Ok(value)
  }

  async fn set(&self, key: &str, value: &str, ttl: u64) -> Result<(), RedisError> {
    let mut conn = self.get_connection().await?;
    conn.set_ex(key, value, ttl).await
  }
}
