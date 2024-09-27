use std::sync::Arc;

use aws_sdk_s3::Client;
use axum::{
  routing::{get, post},
  Extension, Router,
};
use sqlx::PgPool;

use crate::{
  controllers::user_controller::{
    authorize, get_user_image, link_account, login, new_password, new_password_token, register,
    upload_profile_image,
  },
  repositories::user_repository::{UserRepository, UserRepositoryTrait},
};

pub fn user_routes(db: &Arc<PgPool>, r2: &Arc<Client>) -> Router {
  let repository = UserRepository::new(db, r2);

  let user_related_routes = Router::new()
    .route("/profile", post(upload_profile_image))
    .route("/profile/:id", get(get_user_image))
    .route("/reset-password/:token", post(new_password))
    .route("/new-password-token/:email", post(new_password_token));

  Router::new()
    .route("/login", post(login))
    .route("/register", post(register))
    .route("/authorize", post(authorize))
    .route("/link-account", post(link_account))
    .nest("/users", user_related_routes)
    .layer(Extension(repository))
}
