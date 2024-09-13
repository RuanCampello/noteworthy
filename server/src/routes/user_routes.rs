use std::sync::Arc;

use aws_sdk_s3::Client;
use axum::{
    routing::{get, post},
    Extension, Router,
};
use sea_orm::DatabaseConnection;

use crate::{
    controllers::user_controller::{get_user_from_email, get_user_image, login, register},
    repositories::user_repository::{UserRepository, UserRepositoryTrait},
};

pub fn user_routes(db: &Arc<DatabaseConnection>, r2: &Arc<Client>) -> Router {
    let repository = UserRepository::new(db, r2);

    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/users/:email", get(get_user_from_email))
        .route("/users/profile/:id", get(get_user_image))
        .layer(Extension(repository))
}
