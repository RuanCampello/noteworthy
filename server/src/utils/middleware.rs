use axum::{
    async_trait,
    extract::{FromRequestParts, Request},
    http::{header::AUTHORIZATION, request::Parts, StatusCode},
    middleware::Next,
    response::Response,
};

use super::jwt::TokenExtractor;

pub async fn private_route(
    req: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, (StatusCode, &'static str)> {
    let auth_header = req
        .headers()
        .get(AUTHORIZATION)
        .ok_or((StatusCode::UNAUTHORIZED, "Missing Authorization Header"))?;

    let auth_str = auth_header
        .to_str()
        .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid Authorization Header"))?;

    if auth_str.starts_with("Bearer ") {
        Ok(next.run(req).await)
    } else {
        Err((StatusCode::UNAUTHORIZED, "Invalid Authorization Scheme"))
    }
}

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
