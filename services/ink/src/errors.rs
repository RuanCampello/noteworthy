use aws_sdk_s3::{error::SdkError, operation::get_object::GetObjectError};
use aws_sdk_s3::operation::put_object::PutObjectError;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use bcrypt::BcryptError;
use image::ImageError;
use sqlx::Error as SqlxError;
use thiserror::Error;
use uuid::Uuid;
use validator::ValidationErrors;

#[derive(Error, Debug)]
pub enum NoteError {
  #[error("{0} is an invalid colour.")]
  InvalidColour(String),
  #[error("Note with given id {0} was not found.")]
  NoteNotFound(Uuid),
  #[error("Error during request validation.")]
  Validation(#[from] ValidationErrors),
  #[error("Error creating note: {0}.")]
  Sqlx(#[from] SqlxError),
  #[error("Generate note request error: {0}.")]
  Generate(#[from] reqwest::Error),
}

impl IntoResponse for NoteError {
  fn into_response(self) -> Response {
    let status = match self {
      NoteError::NoteNotFound(_) => StatusCode::NOT_FOUND,
      NoteError::Validation(_) => StatusCode::BAD_REQUEST,
      NoteError::InvalidColour(_) => StatusCode::UNPROCESSABLE_ENTITY,
      NoteError::Sqlx(_) | NoteError::Generate(_) => StatusCode::INTERNAL_SERVER_ERROR,
    };

    let body = if status == StatusCode::INTERNAL_SERVER_ERROR {
      String::from("An internal server error occurred")
    } else {
      self.to_string()
    };

    (status, body).into_response()
  }
}
#[derive(Error, Debug)]
pub enum UserError {
  #[error("This account was not found in the database.")]
  UserNotFound,
  #[error("User with this e-mail already exists.")]
  UserAlreadyExist,
  #[error("You entered the wrong credentials.")]
  InvalidCredentials,
  #[error("Error on database: {0}.")]
  DatabaseError(#[from] SqlxError),
  #[error("Error during decryption: {0}.")]
  DecryptError(#[from] BcryptError),
  #[error("Unexpected error on pre-signed url generation: {0}.")]
  PresignedUrl(#[from] SdkError<GetObjectError>),
  #[error("Error during image uploading: {0}")]
  ImageUploadError(#[from] SdkError<PutObjectError>),
  #[error("Error during request validation.")]
  Validation(#[from] ValidationErrors),
}

impl IntoResponse for UserError {
  fn into_response(self) -> Response {
    let status = match self {
      UserError::UserNotFound => StatusCode::NOT_FOUND,
      UserError::Validation(_) => StatusCode::UNPROCESSABLE_ENTITY,
      UserError::InvalidCredentials => StatusCode::BAD_REQUEST,
      UserError::UserAlreadyExist => StatusCode::CONFLICT,
      UserError::DecryptError(_) | UserError::DatabaseError(_) | UserError::PresignedUrl(_) | UserError::ImageUploadError(_) => {
        StatusCode::INTERNAL_SERVER_ERROR
      }
    };

    let body = if status == StatusCode::INTERNAL_SERVER_ERROR {
      String::from("An internal server error occurred")
    } else {
      self.to_string()
    };

    (status, body).into_response()
  }
}

#[derive(Error, Debug)]
pub enum TokenError {
  #[error("Token was not found in headers")]
  NotFound,
  #[error("Token format provided is invalid")]
  InvalidFormat,
}
