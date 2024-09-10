use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
};

use super::jwt::TokenExtractor;

#[derive(Debug)]
pub struct AuthenticatedUser {
    pub id: String,
}

pub struct AuthUser(pub AuthenticatedUser);

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let headers = &parts.headers;

        let decoded_token = match headers.extract_and_decode_token() {
            Ok(token) => token,
            Err((status, err)) => return Err((status, err)),
        };

        Ok(AuthUser(AuthenticatedUser {
            id: decoded_token.id,
        }))
    }
}
