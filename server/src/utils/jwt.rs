use std::error::Error;

use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub id: String,
    pub email: String,
    pub exp: usize,
    pub name: Option<String>,
    pub image: Option<String>,
}

pub fn generate_jwt(
    secret: &str,
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

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_base64_secret(secret)?,
    )?;

    Ok(token)
}

pub fn decode_jwt(secret: &str, token: &str) -> Result<TokenData<Claims>, Box<dyn Error>> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_base64_secret(secret)?,
        &Validation::default(),
    )?;

    Ok(token_data)
}
