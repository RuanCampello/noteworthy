use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use image::{imageops::FilterType, ImageError, ImageFormat};
use std::error::Error as StdError;
use std::fmt::{Display, Formatter};
use std::io::Cursor;

pub fn resize_and_reduce_image(file_bytes: Vec<u8>) -> Result<Vec<u8>, MyImageError> {
  let image = image::load_from_memory(&file_bytes)?;
  let resized_image = image.resize(112, 112, FilterType::Nearest);

  let mut output = Cursor::new(Vec::new());
  resized_image.write_to(&mut output, ImageFormat::Png)?;

  Ok(output.into_inner())
}
#[derive(Debug)]
pub struct MyImageError {
  pub source: ImageError,
}

impl Display for MyImageError {
  fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
    match self.source {
      ImageError::Decoding(ref msg) => write!(f, "{}", msg),
      ImageError::Encoding(ref msg) => write!(f, "{}", msg),
      ImageError::IoError(ref err) => write!(f, "{}", err),
      ImageError::Parameter(ref msg) => write!(f, "{}", msg),
      ImageError::Unsupported(ref msg) => write!(f, "{}", msg),
      ImageError::Limits(ref msg) => write!(f, "{}", msg),
    }
  }
}

impl StdError for MyImageError {}

impl From<ImageError> for MyImageError {
  fn from(source: ImageError) -> Self {
    MyImageError { source }
  }
}

impl IntoResponse for MyImageError {
  fn into_response(self) -> Response {
    let status = match self.source {
      ImageError::Decoding(_) => StatusCode::UNPROCESSABLE_ENTITY,
      ImageError::Encoding(_) => StatusCode::UNPROCESSABLE_ENTITY,
      ImageError::IoError(_) => StatusCode::INTERNAL_SERVER_ERROR,
      ImageError::Parameter(_) => StatusCode::BAD_REQUEST,
      ImageError::Unsupported(_) => StatusCode::UNSUPPORTED_MEDIA_TYPE,
      ImageError::Limits(_) => StatusCode::PAYLOAD_TOO_LARGE,
    };

    let body = String::from("An internal server error occurred");

    (status, body).into_response()
  }
}
