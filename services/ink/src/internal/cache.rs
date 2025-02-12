use crate::errors::CacheError;
use deadpool_redis::{Connection, Pool};
use redis::{AsyncCommands, FromRedisValue, RedisError};
use tracing::error;

#[derive(Clone)]
pub struct Cache {
  pub pool: Pool,
}

impl Cache {
  pub fn new(pool: Pool) -> Self {
    Self { pool }
  }

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

  pub async fn get<T>(&self, key: &str) -> Result<Option<T>, CacheError>
  where
    T: FromRedisValue,
  {
    let mut conn = self.get_connection().await?;
    let value: Option<T> = conn.get(key).await?;

    Ok(value)
  }

  pub async fn set(&self, key: &str, value: &str, ttl: u64) -> Result<(), CacheError> {
    let mut conn = self.get_connection().await?;
    conn.set_ex(key, value, ttl).await?;

    Ok(())
  }

  pub async fn del(&self, key: &str) -> Result<(), CacheError> {
    let mut conn = self.get_connection().await?;
    conn.del(key).await?;

    Ok(())
  }
}
