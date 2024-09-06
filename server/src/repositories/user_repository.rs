use ::chrono::Duration;
use bcrypt::verify;
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Header};
use sea_orm::{sqlx::types::chrono, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::Serialize;
use std::sync::Arc;

use crate::{
    controllers::user_controller::LoginRequest,
    errors::UserError,
    models::users::{self, Entity as User},
};

#[derive(Clone)]
pub struct UserRepository {
    database: Arc<DatabaseConnection>,
}

#[derive(Serialize)]
pub struct Claims {
    id: String,
    email: String,
    exp: usize,
    name: Option<String>,
    image: Option<String>,
}

impl UserRepository {
    pub fn new(database: Arc<DatabaseConnection>) -> Self {
        Self { database }
    }
    pub async fn log_user(
        &self,
        req: &LoginRequest,
        auth_secret: &str,
    ) -> Result<String, UserError> {
        let user = User::find()
            .filter(users::Column::Email.eq(&req.email))
            .one(&*self.database)
            .await
            .map_err(|e| UserError::DatabaseError(e))?
            .ok_or(UserError::UserNotFound)?;

        let correct_password =
            verify(&req.password, &user.password.unwrap()).map_err(UserError::DecryptError)?;

        if !correct_password {
            return Err(UserError::InvalidCredentials);
        }

        let expiration = Utc::now()
            .checked_add_signed(Duration::hours(24))
            .expect("valid timestamp")
            .timestamp() as usize;

        let claims = Claims {
            id: user.id,
            email: user.email.unwrap(),
            exp: expiration,
            image: user.image,
            name: user.name,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_base64_secret(auth_secret).unwrap(),
        )
        .expect("Error generating token");

        Ok(token)
    }
}
