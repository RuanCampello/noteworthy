use crate::utils::image::MyImageError;
use aws_sdk_s3::operation::put_object::PutObjectError;
use aws_sdk_s3::{error::SdkError, operation::get_object::GetObjectError};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use bcrypt::BcryptError;
use reqwest::Error as ReqwestError;
use resend_rs::Error as ResendError;
use sqlx::Error as SqlxError;
use thiserror::Error;
use tracing::error;
use uuid::Uuid;
use validator::ValidationErrors;

#[derive(Error, Debug)]
pub enum NoteError {
  #[error("{0} is an invalid colour.")]
  InvalidColour(String),
  #[error("Colour is missing.")]
  MissingColour,
  #[error("Note with given id {0} was not found.")]
  NoteNotFound(Uuid),
  #[error("Error during request validation.")]
  Validation(#[from] ValidationErrors),
  #[error("Error creating note: {0}.")]
  Sqlx(#[from] SqlxError),
  #[error("Parsing error: {0}")]
  Parse(#[from] serde_json::Error),
  #[error("{0}")]
  Cache(#[from] CacheError),
  #[error("Generate note request error: {0}.")]
  Generate(#[from] reqwest::Error),
}

impl IntoResponse for NoteError {
  fn into_response(self) -> Response {
    let status = match self {
      NoteError::NoteNotFound(_) => StatusCode::NOT_FOUND,
      NoteError::Validation(_) | NoteError::MissingColour => StatusCode::BAD_REQUEST,
      NoteError::InvalidColour(_) => StatusCode::UNPROCESSABLE_ENTITY,
      NoteError::Sqlx(_) | NoteError::Generate(_) | NoteError::Cache(_) | NoteError::Parse(_) => {
        StatusCode::INTERNAL_SERVER_ERROR
      }
    };

    let body = if status == StatusCode::INTERNAL_SERVER_ERROR {
      error!("{:#?}", self);
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
  #[error("Reset password token not found.")]
  TokenNotFound,
  #[error("Token has already expired.")]
  TokenExpired,
  #[error("This token is invalid.")]
  TokenInvalid,
  #[error("Multipart form data is required.")]
  MultipartRequired,
  #[error("Error during image processing: {0}.")]
  MyImageError(#[from] MyImageError),
  #[error("Failed to send user reset password email: {0}")]
  SendEmail(#[from] ResendError),
  #[error("{0}")]
  Cache(#[from] CacheError),
}

impl IntoResponse for UserError {
  fn into_response(self) -> Response {
    let (status, body) = match self {
      UserError::MyImageError(err) => {
        return err.into_response();
      }
      UserError::UserNotFound | UserError::TokenNotFound => {
        (StatusCode::NOT_FOUND, self.to_string())
      }
      UserError::Validation(_) => (StatusCode::UNPROCESSABLE_ENTITY, self.to_string()),
      UserError::InvalidCredentials | UserError::MultipartRequired | UserError::TokenInvalid => {
        (StatusCode::BAD_REQUEST, self.to_string())
      }
      UserError::UserAlreadyExist => (StatusCode::CONFLICT, self.to_string()),
      UserError::TokenExpired => (StatusCode::FORBIDDEN, self.to_string()),
      UserError::DecryptError(_)
      | UserError::DatabaseError(_)
      | UserError::PresignedUrl(_)
      | UserError::ImageUploadError(_)
      | UserError::SendEmail(_)
      | UserError::Cache(_) => {
        error!("{:#?}", self);
        (
          StatusCode::INTERNAL_SERVER_ERROR,
          String::from("An internal server error occurred"),
        )
      }
    };

    (status, body).into_response()
  }
}

#[derive(Error, Debug)]
pub enum DictionaryError {
  #[error("No definitions found for word: {word} in language: {language}")]
  NotFound { word: String, language: String },
  #[error("HTTP error: {0}")]
  Http(#[from] ReqwestError),
}

impl IntoResponse for DictionaryError {
  fn into_response(self) -> Response {
    let status = match self {
      DictionaryError::NotFound { .. } => StatusCode::NOT_FOUND,
      DictionaryError::Http(_) => StatusCode::BAD_GATEWAY,
    };

    error!("{:#?}", self);

    let body = if status == StatusCode::INTERNAL_SERVER_ERROR {
      String::from("An internal server error occurred")
    } else {
      self.to_string()
    };

    (status, body).into_response()
  }
}

#[derive(Error, Debug)]
pub enum CacheError {
  #[error("Unable to deserialize the cache value {0}")]
  Deserialize(#[from] serde_json::Error),
  #[error("Redis failure {0}")]
  Redis(#[from] redis::RedisError),
}

impl IntoResponse for CacheError {
  fn into_response(self) -> Response {
    let status = match self {
      CacheError::Deserialize(_) | CacheError::Redis(_) => StatusCode::INTERNAL_SERVER_ERROR,
    };

    error!("{:#?}", self);

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
