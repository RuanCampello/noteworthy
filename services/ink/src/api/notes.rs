use crate::app_state::AppState;
use crate::errors::NoteError;
use crate::models::notes::{
  Colour, GeneratedNoteResponse, NoteWithUserPrefs, PartialNote, RandomColour, SearchResult,
};
use crate::utils::{
  constants::HELLO_WORLD,
  middleware::AuthUser,
  sanitization::{strip_html_except_search, RULES},
};
use axum::{
  extract::{Json, Path, Query},
  routing::{delete, get, patch, post},
  Extension, Router,
};
use chrono::Local;
use regex::Regex;
use sanitize_html::sanitize_str;
use serde::Deserialize;
use uuid::Uuid;
use validator::Validate;

pub(crate) fn router() -> Router {
  let single_note_route = Router::new()
    .route(
      "/:id",
      delete(delete_note).patch(edit_note).get(find_note_by_id),
    )
    .route("/:id/favourite", patch(toggle_note_favourite))
    .route("/:id/archive", patch(toggle_note_archived))
    .route(
      "/:id/public",
      patch(toggle_note_publicity).get(find_note_public_state),
    )
    .route("/:id/content", patch(edit_note_content));

  let notes_route = Router::new()
    .route("/", post(new_note).get(find_all_user_notes))
    .route("/count", get(count_user_notes))
    .route("/generate", post(generate_note))
    .route("/search", get(search_notes))
    .route("/placeholder/:user_id", post(new_placeholder_note));

  Router::new().nest("/notes", notes_route.merge(single_note_route))
}

#[derive(Deserialize, Validate)]
pub struct CreateNoteRequest {
  #[validate(length(min = 4))]
  pub title: String,
  pub content: Option<String>,
  pub colour: Option<String>,
}

async fn new_note(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  Json(req): Json<CreateNoteRequest>,
) -> Result<Json<Uuid>, NoteError> {
  let colour = req
    .colour
    .as_ref()
    .ok_or(NoteError::MissingColour)?
    .parse::<Colour>()?;

  req.validate()?;

  let localtime = Local::now().naive_local();
  let query = r#"
      INSERT INTO notes (title, content, user_id, colour, created_at, last_update)
      VALUES ($1, $2, $3, $4::colour, $5, $5)
      RETURNING id;
    "#;

  let id: Uuid = sqlx::query_scalar(query)
    .bind(&req.title)
    .bind(&req.content)
    .bind(user.id)
    .bind(colour.to_string())
    .bind(localtime)
    .fetch_one(&state.database)
    .await?;

  Ok(Json(id))
}

async fn generate_note(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
) -> Result<Json<Uuid>, NoteError> {
  let response =
    reqwest::get("https://tense-beulah-ruancampello-4be3a646.koyeb.app/generate").await?;

  let generated_note = response.json::<GeneratedNoteResponse>().await?;
  let colour = Colour::random().to_string();
  let req = CreateNoteRequest {
    colour: Some(colour),
    content: Some(generated_note.content),
    title: generated_note.title,
  };

  let id = new_note(Extension(state), AuthUser(user), Json(req)).await?;

  Ok(id)
}

async fn new_placeholder_note(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
) -> Result<(), NoteError> {
  let colour = Colour::random().to_string();
  let req = CreateNoteRequest {
    colour: Some(colour),
    content: Some(HELLO_WORLD.to_string()),
    title: String::from("Hello World 📝"),
  };

  let _ = new_note(Extension(state), AuthUser(user), Json(req)).await?;

  Ok(())
}

async fn delete_note(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
) -> Result<(), NoteError> {
  let query = r#"
      DELETE FROM notes
      WHERE id = $1 AND user_id = $2;
    "#;

  sqlx::query(query)
    .bind(id)
    .bind(user.id)
    .execute(&state.database)
    .await?;

  Ok(())
}

#[derive(Deserialize, Validate)]
pub struct UpdateNoteRequest {
  #[validate(length(min = 4))]
  pub title: Option<String>,
  pub colour: String,
}

async fn edit_note(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
  Json(req): Json<UpdateNoteRequest>,
) -> Result<(), NoteError> {
  let colour = &req.colour.parse::<Colour>()?;
  req.validate()?;

  let query = r#"
      UPDATE notes
      SET title = $3, colour = $4::colour, last_update = $5
      WHERE id = $1 AND user_id = $2;
    "#;
  let localtime = Local::now().naive_local();

  sqlx::query(query)
    .bind(id)
    .bind(user.id)
    .bind(req.title)
    .bind(colour.to_string())
    .bind(localtime)
    .execute(&state.database)
    .await?;

  Ok(())
}

const FIND_NOTE_BY_ID_QUERY: &str = r#"
  SELECT
    notes.*,
    notes.colour,
    notes.user_id AS user_id,
    users.name,
    COALESCE(users_preferences.full_note, true) AS full_note,
    COALESCE(users_preferences.note_format, 'full') AS note_format
  FROM notes
  JOIN users ON notes.user_id = users.id
  LEFT JOIN users_preferences ON users_preferences.user_id = users.id
  WHERE notes.id = $1 AND notes.user_id = $2;
"#;

async fn find_note_by_id(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  Path(id): Path<Uuid>,
) -> Result<Json<NoteWithUserPrefs>, NoteError> {
  let note = sqlx::query_as::<_, NoteWithUserPrefs>(FIND_NOTE_BY_ID_QUERY)
    .bind(id)
    .bind(user.id)
    .fetch_one(&state.database)
    .await?;

  Ok(Json(note))
}

#[derive(serde::Deserialize)]
struct NoteParams {
  is_fav: Option<bool>,
  is_arc: Option<bool>,
}

const FIND_ALL_USER_NOTES_QUERY: &str = r#"
  SELECT LEFT(content, 250) AS content, id, title, colour, created_at
  FROM notes
  WHERE user_id = $1
    AND is_favourite = $2
    AND is_archived = $3
  ORDER BY last_update DESC;
"#;

async fn find_all_user_notes(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  Query(params): Query<NoteParams>,
) -> Result<Json<Vec<PartialNote>>, NoteError> {
  let is_fav = params.is_fav.unwrap_or(false);
  let is_arc = params.is_arc.unwrap_or(false);

  let notes = sqlx::query_as::<_, PartialNote>(FIND_ALL_USER_NOTES_QUERY)
    .bind(user.id)
    .bind(is_fav)
    .bind(is_arc)
    .fetch_all(&state.database)
    .await?;

  let regex = Regex::new(r"<[^>]*>").expect("Invalid regex");

  let stripped_notes = notes
    .into_iter()
    .map(|mut note| {
      note.content = regex.replace_all(&note.content, "").to_string();
      note
    })
    .collect::<Vec<_>>();

  Ok(Json(stripped_notes))
}

#[derive(Deserialize)]
pub struct UpdateNoteContentRequest {
  content: String,
}

async fn edit_note_content(
  Extension(state): Extension<AppState>,
  Path(id): Path<Uuid>,
  AuthUser(user): AuthUser,
  Json(req): Json<UpdateNoteContentRequest>,
) -> Result<(), NoteError> {
  let query = r#"
      UPDATE notes
      SET content = $3, last_update = $4
      WHERE id = $1 AND user_id = $2;
    "#;
  let localtime = Local::now().naive_local();

  sqlx::query(query)
    .bind(id)
    .bind(user.id)
    .bind(req.content)
    .bind(localtime)
    .execute(&state.database)
    .await?;

  Ok(())
}

async fn toggle_note_favourite(
  Extension(state): Extension<AppState>,
  Path(id): Path<Uuid>,
  AuthUser(user): AuthUser,
) -> Result<(), NoteError> {
  let query = r#"
      UPDATE notes
      SET is_favourite = NOT is_favourite
      WHERE id = $1 AND user_id = $2;
    "#;

  sqlx::query(query)
    .bind(id)
    .bind(user.id)
    .execute(&state.database)
    .await?;

  Ok(())
}

async fn toggle_note_archived(
  Extension(state): Extension<AppState>,
  Path(id): Path<Uuid>,
  AuthUser(user): AuthUser,
) -> Result<(), NoteError> {
  let query = r#"
      UPDATE notes
      SET is_archived = NOT is_archived
      WHERE id = $1 AND user_id = $2;
    "#;

  sqlx::query(query)
    .bind(id)
    .bind(user.id)
    .execute(&state.database)
    .await?;

  Ok(())
}

async fn toggle_note_publicity(
  Extension(state): Extension<AppState>,
  Path(id): Path<Uuid>,
  AuthUser(user): AuthUser,
) -> Result<(), NoteError> {
  let query = r#"
      UPDATE notes
      SET is_public = NOT is_public
      WHERE id = $1 AND user_id = $2;
    "#;

  sqlx::query(query)
    .bind(id)
    .bind(user.id)
    .execute(&state.database)
    .await?;

  Ok(())
}

pub async fn find_note_public_state(
  Extension(state): Extension<AppState>,
  Path(id): Path<Uuid>,
  AuthUser(user): AuthUser,
) -> Result<Json<bool>, NoteError> {
  let query = "SELECT is_public FROM notes WHERE id = $1 AND user_id = $2";

  let is_public = sqlx::query_scalar::<_, bool>(query)
    .bind(id)
    .bind(user.id)
    .fetch_one(&state.database)
    .await?;

  Ok(Json(is_public))
}

#[derive(Deserialize)]
struct SearchParams {
  pub q: String,
  pub is_fav: bool,
  pub is_arc: bool,
}

async fn search_notes(
  Extension(state): Extension<AppState>,
  Query(params): Query<SearchParams>,
  AuthUser(user): AuthUser,
) -> Result<Json<Vec<SearchResult>>, NoteError> {
  let mut query = r#"
      SELECT id, title, LEFT(content, 300) AS content, ts_headline('english', "content", to_tsquery('english', $2 || ':*'),
      'MaxWords=30, MinWords=20, MaxFragments=3, HighlightAll=true, StartSel=<search>, StopSel=</search>') AS highlighted_content
      FROM notes
      WHERE user_id = $1
      AND (to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', $2 || ':*'))
      LIMIT 5
    "#.to_string();

  if params.is_fav {
    query.push_str(" AND is_favourite = true")
  } else if params.is_arc {
    query.push_str(" AND is_archived = true")
  };

  let notes_found = sqlx::query_as::<_, SearchResult>(query.as_str())
    .bind(user.id)
    .bind(params.q)
    .fetch_all(&state.database)
    .await?;

  let regex = Regex::new(r"<[^>]*>").expect("Invalid regex");
  let search_regex = Regex::new(r"<search>.*?</search>").expect("Invalid regex");

  let stripped_notes_found = notes_found
    .into_iter()
    .map(|mut note| {
      note.content = regex.replace_all(&note.content, "").to_string();
      if search_regex.is_match(&note.highlighted_content) {
        let cleaned_up = strip_html_except_search(&note.highlighted_content);
        note.highlighted_content = sanitize_str(&RULES(), &cleaned_up).expect("Invalid HTML")
      } else {
        let cleaned_up = regex.replace_all(&note.content, "").to_string();
        note.highlighted_content = sanitize_str(&RULES(), &cleaned_up).expect("Invalid HTML");
      }
      note
    })
    .collect::<Vec<_>>();

  Ok(Json(stripped_notes_found))
}

async fn count_user_notes(
  Extension(state): Extension<AppState>,
  AuthUser(user): AuthUser,
  Query(params): Query<NoteParams>,
) -> Result<Json<i64>, NoteError> {
  let query = r#"
      SELECT COUNT (title) FROM notes
      WHERE user_id = $1
        AND is_favourite = $2
        AND is_archived = $3
    "#;

  let number_of_notes = sqlx::query_scalar::<_, i64>(query)
    .bind(user.id)
    .bind(params.is_fav)
    .bind(params.is_arc)
    .fetch_one(&state.database)
    .await?;

  Ok(Json(number_of_notes))
}
