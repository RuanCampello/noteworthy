use crate::controllers::note_controller::SearchParams;
use crate::models::notes::{GeneratedNoteResponse, NoteWithUserPrefs, SearchResult};
use crate::utils::hello_world_note::HELLO_WORLD;
use crate::{
  controllers::note_controller::{CreateNoteRequest, UpdateNoteRequest},
  errors::NoteError,
  models::{
    enums::{Colour, RandomColour, SearchFilter},
    notes::PartialNote,
  },
};
use chrono::Local;
use sqlx::PgPool;
use std::sync::Arc;
use uuid::Uuid;
use validator::Validate;

#[derive(Clone)]
pub struct NoteRepository {
  database: Arc<PgPool>,
}

impl NoteRepository {
  pub fn new(database: &Arc<PgPool>) -> Self {
    Self {
      database: Arc::clone(database),
    }
  }

  pub async fn new_note(&self, req: &CreateNoteRequest, user_id: &str) -> Result<Uuid, NoteError> {
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
      .bind(user_id)
      .bind(colour.to_string())
      .bind(localtime)
      .fetch_one(&*self.database)
      .await?;

    Ok(id)
  }

  pub async fn generate_note(&self, user_id: &str) -> Result<Uuid, NoteError> {
    let response =
      reqwest::get("https://tense-beulah-ruancampello-4be3a646.koyeb.app/generate").await?;

    let generated_note = response.json::<GeneratedNoteResponse>().await?;
    let colour = Colour::random().to_string();
    let req = CreateNoteRequest {
      colour: Some(colour),
      content: Some(generated_note.content),
      title: generated_note.title,
    };

    let id = self.new_note(&req, user_id).await?;

    Ok(id)
  }

  pub async fn new_placeholder_note(&self, user_id: &str) -> Result<(), NoteError> {
    let colour = Colour::random().to_string();
    let req = CreateNoteRequest {
      colour: Some(colour),
      content: Some(HELLO_WORLD.to_string()),
      title: String::from("Hello World 📝"),
    };

    let _ = self.new_note(&req, user_id).await?;

    Ok(())
  }

  pub async fn delete_note(&self, user_id: &str, id: Uuid) -> Result<(), NoteError> {
    let query = r#"
      DELETE FROM notes
      WHERE id = $1 AND user_id = $2;
    "#;

    sqlx::query(query)
      .bind(id)
      .bind(user_id)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  pub async fn edit_note(
    &self,
    user_id: &str,
    id: Uuid,
    req: UpdateNoteRequest,
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
      .bind(user_id)
      .bind(req.title)
      .bind(colour.to_string())
      .bind(localtime)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  pub async fn find_note_by_id(
    &self,
    user_id: &str,
    id: Uuid,
  ) -> Result<NoteWithUserPrefs, NoteError> {
    let query = r#"
      SELECT
        notes.*,
        notes.colour::text AS colour,
        notes.user_id AS user_id,
        users.name,
        COALESCE(users_preferences.full_note, true) AS full_note,
        COALESCE(users_preferences.note_format::text, 'full') AS note_format
      FROM notes
      JOIN users ON notes.user_id = users.id
      LEFT JOIN users_preferences ON users_preferences.user_id = users.id
      WHERE notes.id = $1 AND notes.user_id = $2;
    "#;

    let notes = sqlx::query_as::<_, NoteWithUserPrefs>(query)
      .bind(id)
      .bind(user_id)
      .fetch_one(&*self.database)
      .await?;

    Ok(notes)
  }

  pub async fn find_all_user_notes(
    &self,
    user_id: &str,
    is_fav: bool,
    is_arc: bool,
  ) -> Result<Vec<PartialNote>, NoteError> {
    let query = r#"
      SELECT LEFT(content, 250) AS content, id, title, colour::text AS colour, created_at
      FROM notes
      WHERE user_id = $1
        AND is_favourite = $2
        AND is_archived = $3
      ORDER BY last_update DESC;
    "#;

    let notes = sqlx::query_as::<_, PartialNote>(query)
      .bind(user_id)
      .bind(is_fav)
      .bind(is_arc)
      .fetch_all(&*self.database)
      .await?;

    Ok(notes)
  }

  pub async fn edit_note_content(
    &self,
    id: Uuid,
    user_id: &str,
    content: String,
  ) -> Result<(), NoteError> {
    let query = r#"
      UPDATE notes
      SET content = $3, last_update = $4
      WHERE id = $1 AND user_id = $2;
    "#;
    let localtime = Local::now().naive_local();

    sqlx::query(query)
      .bind(id)
      .bind(user_id)
      .bind(content)
      .bind(localtime)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  pub async fn toggle_note_favourite(&self, id: Uuid, user_id: &str) -> Result<(), NoteError> {
    let query = r#"
      UPDATE notes
      SET is_favourite = NOT is_favourite
      WHERE id = $1 AND user_id = $2;
    "#;

    sqlx::query(query)
      .bind(id)
      .bind(user_id)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  pub async fn toggle_note_archived(&self, id: Uuid, user_id: &str) -> Result<(), NoteError> {
    let query = r#"
      UPDATE notes
      SET is_archived = NOT is_archived
      WHERE id = $1 AND user_id = $2;
    "#;

    sqlx::query(query)
      .bind(id)
      .bind(user_id)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  pub async fn toggle_note_publicity(&self, id: Uuid, user_id: &str) -> Result<(), NoteError> {
    let query = r#"
      UPDATE notes
      SET is_public = NOT is_public
      WHERE id = $1 AND user_id = $2;
    "#;

    sqlx::query(query)
      .bind(id)
      .bind(user_id)
      .execute(&*self.database)
      .await?;

    Ok(())
  }

  pub async fn find_note_public_state(&self, id: Uuid, user_id: &str) -> Result<bool, NoteError> {
    let query = "SELECT is_public FROM notes WHERE id = $1 AND user_id = $2";

    let is_public = sqlx::query_scalar::<_, bool>(query)
      .bind(id)
      .bind(user_id)
      .fetch_one(&*self.database)
      .await?;

    Ok(is_public)
  }

  pub async fn search_notes(
    &self,
    user_id: &str,
    params: SearchParams,
  ) -> Result<Vec<SearchResult>, NoteError> {
    let mut query = r#"
      SELECT id, title, content, ts_headline('english', "content", to_tsquery('english', $2 || ':*'),
      'MaxWords=30, MinWords=20, MaxFragments=3, HighlightAll=true, StartSel=<search>, StopSel=</search>') AS highlighted_content
      FROM notes
      WHERE user_id = $1 AND (to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', $2 || ':*'))
      LIMIT 5
    "#.to_string();

    match params.filter {
      Some(SearchFilter::Favourites) => query.push_str(" AND is_favourite = true"),
      Some(SearchFilter::Archived) => query.push_str(" AND is_archived = true"),
      _ => {}
    };

    let notes_found = sqlx::query_as::<_, SearchResult>(query.as_str())
      .bind(user_id)
      .bind(params.q)
      .fetch_all(&*self.database)
      .await?;

    Ok(notes_found)
  }

  pub async fn count_user_notes(
    &self,
    user_id: &str,
    is_fav: bool,
    is_arc: bool,
  ) -> Result<i64, NoteError> {
    let query = r#"
      SELECT COUNT (title) FROM notes
      WHERE user_id = $1
        AND is_favourite = $2
        AND is_archived = $3
    "#;

    let number_of_notes = sqlx::query_scalar::<_, i64>(query)
      .bind(user_id)
      .bind(is_fav)
      .bind(is_arc)
      .fetch_one(&*self.database)
      .await?;

    Ok(number_of_notes)
  }
}
