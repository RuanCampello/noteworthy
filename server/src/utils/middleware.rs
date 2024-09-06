use axum::{
    http::{header::AUTHORIZATION, Request, StatusCode},
    middleware::Next,
    response::Response,
};

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
