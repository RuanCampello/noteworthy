use bcrypt::{hash, verify};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use std::sync::Arc;
use tracing::info;

use crate::{
    controllers::user_controller::{LoginRequest, RegisterRequest},
    errors::UserError,
    models::users::{self, Entity as User},
    utils::jwt::generate_jwt,
};

#[derive(Clone)]
pub struct UserRepository {
    database: Arc<DatabaseConnection>,
}

impl UserRepository {
    pub fn new(database: Arc<DatabaseConnection>) -> Self {
        Self { database }
    }
    pub async fn log_user(&self, req: &LoginRequest) -> Result<String, UserError> {
        let user = self.find_user_by_email(&req.email).await?;

        let correct_password =
            verify(&req.password, &user.password.unwrap()).map_err(UserError::DecryptError)?;

        if !correct_password {
            return Err(UserError::InvalidCredentials);
        }

        let token = generate_jwt(user.id, user.email.unwrap(), user.name, user.image)
            .expect("Error generation JWT token");

        Ok(token)
    }

    pub async fn find_user_by_email(&self, email: &str) -> Result<users::Model, UserError> {
        match User::find()
            .filter(users::Column::Email.eq(email))
            .one(&*self.database)
            .await?
        {
            None => Err(UserError::UserNotFound),
            Some(user) => Ok(user),
        }
    }

    pub async fn create_user(&self, req: RegisterRequest) -> Result<String, UserError> {
        let hash_password = hash(req.password, 10).unwrap();

        let user = users::ActiveModel {
            id: Set(cuid2::create_id()),
            name: Set(Some(req.name)),
            email: Set(Some(req.email)),
            password: Set(Some(hash_password)),
            ..Default::default()
        }
        .insert(&*self.database)
        .await?;

        Ok(user.id)
    }
}
