use aws_sdk_s3::{error::SdkError, operation::get_object::GetObjectError};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use bcrypt::BcryptError;
use sqlx::Error as SqlxError;
use thiserror::Error;
use uuid::Uuid;

#[derive(Error, Debug)]
pub enum NoteError {
  #[error("User with id {0} was not found")]
  NoteOwnerNotFound(String),
  #[error("Note with given id {0} was not found")]
  NoteNotFound(Uuid),
  #[error("Error creating note: {0}")]
  InsertError(#[from] SqlxError),
}

impl IntoResponse for NoteError {
  fn into_response(self) -> Response {
    let status = match self {
      NoteError::NoteOwnerNotFound(_) | NoteError::NoteNotFound(_) => StatusCode::NOT_FOUND,
      NoteError::InsertError(_) => StatusCode::INTERNAL_SERVER_ERROR,
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
  #[error("This account was not found in the database")]
  UserNotFound,
  #[error("You entered the wrong credentials")]
  InvalidCredentials,
  #[error("Error on database: {0}")]
  DatabaseError(#[from] SqlxError),
  #[error("Error during decryption: {0}")]
  DecryptError(#[from] BcryptError),
  #[error("Unexpected error on presigned url generation: {0}")]
  PresignedUrl(#[from] SdkError<GetObjectError>),
}

#[derive(Error, Debug)]
pub enum TokenError {
  #[error("Token was not found in headers")]
  NotFound,
  #[error("Token format provided is invalid")]
  InvalidFormat,
}
