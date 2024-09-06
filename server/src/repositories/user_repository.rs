use bcrypt::verify;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::Serialize;
use std::sync::Arc;

use crate::{
    controllers::user_controller::LoginRequest,
    errors::UserError,
    models::users::{self, Entity as User},
    utils::jwt::generate_jwt,
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
    pub async fn log_user(&self, req: &LoginRequest) -> Result<String, UserError> {
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

        let token = generate_jwt(user.id, user.email.unwrap(), user.name, user.image)
            .expect("Error generation JWT token");

        Ok(token)
    }
}
