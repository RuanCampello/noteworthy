use std::error::Error;

use axum::http::{HeaderMap, StatusCode};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};

use crate::errors::TokenError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
  pub id: String,
  pub email: String,
  pub exp: usize,
  pub name: Option<String>,
  pub image: Option<String>,
}

#[derive(Clone)]
pub struct JwtManager {
  secret: String,
}

impl JwtManager {
  pub fn new(secret: &str) -> Self {
    Self {
      secret: secret.to_string(),
    }
  }

  pub fn generate_jwt(
    &self,
    user_id: String,
    email: String,
    name: Option<String>,
    image: Option<String>,
  ) -> Result<String, Box<dyn Error>> {
    let expiration = Utc::now()
      .checked_add_signed(Duration::hours(12))
      .expect("valid timestamp")
      .timestamp() as usize;

    let claims = Claims {
      id: user_id,
      email,
      exp: expiration,
      name,
      image,
    };

    let token = encode(
      &Header::default(),
      &claims,
      &EncodingKey::from_base64_secret(&self.secret)?,
    )?;

    Ok(token)
  }

  pub fn decode_jwt(
    &self,
    token: &str,
    validate_exp: bool,
  ) -> Result<TokenData<Claims>, Box<dyn Error>> {
    let mut validation = Validation::default();
    validation.validate_exp = validate_exp;

    let token_data = decode::<Claims>(
      token,
      &DecodingKey::from_base64_secret(&self.secret)?,
      &validation,
    )?;

    Ok(token_data)
  }

  pub fn refresh_jwt(&self, claims: Claims) -> Result<String, Box<dyn Error>> {
    let expiration = Utc::now()
      .checked_add_signed(Duration::hours(12))
      .expect("valid timestamp")
      .timestamp() as usize;

    let new_claims = Claims {
      id: claims.id,
      email: claims.email,
      exp: expiration,
      name: claims.name,
      image: claims.image,
    };

    let token = encode(
      &Header::default(),
      &new_claims,
      &EncodingKey::from_base64_secret(&self.secret)?,
    )?;

    Ok(token)
  }
}

pub trait TokenExtractor {
  fn extract_bearer_token(&self) -> Result<String, TokenError>;
  fn extract_and_decode_token(
    &self,
    jwt_manager: &JwtManager,
  ) -> Result<Claims, (StatusCode, String)>;
}

impl TokenExtractor for HeaderMap {
  fn extract_bearer_token(&self) -> Result<String, TokenError> {
    let auth_header = self
      .get("Authorization")
      .ok_or_else(|| TokenError::NotFound)?;

    let auth_str = auth_header.to_str().unwrap();

    if !auth_str.starts_with("Bearer ") {
      return Err(TokenError::InvalidFormat);
    }

    let token = auth_str.trim_start_matches("Bearer ");
    Ok(token.to_string())
  }
  fn extract_and_decode_token(
    &self,
    jwt_manager: &JwtManager,
  ) -> Result<Claims, (StatusCode, String)> {
    let token = self
      .extract_bearer_token()
      .map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))?;

    let decoded_token = jwt_manager
      .decode_jwt(&token, true)
      .map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?;

    Ok(decoded_token.claims)
  }
}
