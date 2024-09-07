use std::error::Error;

use axum::{
    extract::Path,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use tracing::{error, info};

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

        let mut validation = Validation::default();
        validation.validate_exp = false;

        let token_data = decode::<Claims>(
            self,
            &DecodingKey::from_base64_secret(&env.jwt_secret)?,
            &validation,
        )?;

        Ok(token_data)
    }
}

pub fn refresh_jwt(claims: Claims, secret: &str) -> Result<String, Box<dyn Error>> {
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
        &EncodingKey::from_base64_secret(secret)?,
    )?;

    Ok(token)
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

pub async fn refresh_handler(Path(old_token): Path<String>) -> impl IntoResponse {
    info!("On refresh on server");
    let env = EnvVariables::from_env().expect("Env variables to be set");
    let decoded_old_token = match old_token.decode_jwt() {
        Ok(token) => token,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                TokenError::InvalidFormat.to_string(),
            )
                .into_response()
        }
    };

    let refreshed_token = match refresh_jwt(decoded_old_token.claims, &env.jwt_secret) {
        Ok(token) => token,
        Err(e) => {
            error!("Refresh token error {:#?}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR).into_response();
        }
    };

    (StatusCode::OK, Json(refreshed_token)).into_response()
}
