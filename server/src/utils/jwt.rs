use std::error::Error;

use axum::http::HeaderMap;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};

use crate::{app_state::EnvVariables, errors::TokenError};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub id: String,
    pub email: String,
    pub exp: usize,
    pub name: Option<String>,
    pub image: Option<String>,
}

pub fn generate_jwt(
    user_id: String,
    email: String,
    name: Option<String>,
    image: Option<String>,
) -> Result<String, Box<dyn Error>> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        id: user_id,
        email,
        exp: expiration,
        name,
        image,
    };

    let env = EnvVariables::from_env()?;

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_base64_secret(&env.jwt_secret)?,
    )?;

    Ok(token)
}

pub trait JwtDecoder {
    fn decode_jwt(&self) -> Result<TokenData<Claims>, Box<dyn Error>>;
}

impl JwtDecoder for String {
    fn decode_jwt(&self) -> Result<TokenData<Claims>, Box<dyn Error>> {
        let env = EnvVariables::from_env()?;
        let token_data = decode::<Claims>(
            self,
            &DecodingKey::from_base64_secret(&env.jwt_secret)?,
            &Validation::default(),
        )?;

        Ok(token_data)
    }
}

pub trait TokenExtractor {
    fn extract_bearer_token(&self) -> Result<String, TokenError>;
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
}
