use sea_orm::{
    prelude::Uuid, ActiveModelTrait, ActiveValue, ColumnTrait, DatabaseConnection, DbBackend,
    EntityTrait, FromQueryResult, QueryFilter, QueryOrder, Statement,
};
use std::sync::Arc;
use tracing::info;

use crate::{
    controllers::note_controller::{ColourOption, CreateNoteRequest, UpdateNoteRequest},
    errors::NoteError,
    models::{
        notes::{self, Entity as Note, NoteWithUserPrefs},
        sea_orm_active_enums::Colour,
        users::Entity as User,
    },
};

#[derive(Clone)]
pub struct NoteRepository {
    database: Arc<DatabaseConnection>,
}

impl NoteRepository {
    pub fn new(database: Arc<DatabaseConnection>) -> Self {
        Self { database }
    }

    pub async fn new_note(
        &self,
        req: &CreateNoteRequest,
        user_id: &str,
    ) -> Result<Uuid, NoteError> {
        let colour = match &req.colour {
            ColourOption::Colour(c) => Colour::from(c.as_str()),
        };

        let user = User::find_by_id(user_id)
            .one(&*self.database)
            .await
            .map_err(|_| NoteError::NoteOwnerNotFound(user_id.to_string()))?;

        let user_id = match user {
            Some(user) => user.id,
            None => return Err(NoteError::NoteOwnerNotFound(user_id.to_string())),
        };

        let note = notes::ActiveModel {
            title: ActiveValue::set(req.title.to_owned()),
            content: ActiveValue::set(req.content.to_owned().unwrap_or_else(|| String::new())),
            colour: ActiveValue::set(colour),
            user_id: ActiveValue::set(user_id),
            ..Default::default()
        };

        let note = note
            .insert(&*self.database)
            .await
            .map_err(|e| NoteError::InsertError(e))?;

        Ok(note.id)
    }

    pub async fn delete_note(&self, user_id: &str, id: Uuid) -> Result<(), NoteError> {
        let note = Note::find_by_id(id)
            .filter(notes::Column::UserId.eq(user_id))
            .one(&*self.database)
            .await?
            .ok_or(NoteError::NoteNotFound(id))?;

        Note::delete_by_id(note.id).exec(&*self.database).await?;

        Ok(())
    }

    pub async fn edit_note(
        &self,
        user_id: &str,
        id: Uuid,
        req: UpdateNoteRequest,
    ) -> Result<(), NoteError> {
        let old_note = Note::find_by_id(id)
            .filter(notes::Column::UserId.eq(user_id))
            .one(&*self.database)
            .await?
            .ok_or(NoteError::NoteNotFound(id))?;

        let colour = match &req.colour {
            ColourOption::Colour(c) => Colour::from(c.as_str()),
        };

        let note = notes::ActiveModel {
            title: ActiveValue::set(req.title.unwrap_or(old_note.title.to_string())),
            colour: ActiveValue::set(colour),
            ..old_note.into()
        };

        note.update(&*self.database).await?;
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
              notes."userId" AS user_id,
              users.name,
              users_preferences.full_note,
              users_preferences.note_format::text AS note_format
          FROM notes
          JOIN users ON notes."userId" = users.id
          JOIN users_preferences ON users_preferences."userId" = users.id
          WHERE notes.id = $1 AND notes."userId" = $2;
      "#;

        let result = NoteWithUserPrefs::find_by_statement(Statement::from_sql_and_values(
            DbBackend::Postgres,
            query,
            [id.into(), user_id.into()],
        ))
        .one(self.database.as_ref())
        .await?
        .unwrap();

        info!("result {:#?}", result);
        Ok(result)
    }

    pub async fn find_all_user_notes(&self, user_id: &str) -> Result<Vec<notes::Model>, NoteError> {
        let notes = Note::find()
            .filter(notes::Column::UserId.eq(user_id))
            .filter(notes::Column::IsArchived.eq(false))
            .filter(notes::Column::IsFavourite.eq(false))
            .order_by_desc(notes::Column::LastUpdate)
            .all(&*self.database)
            .await?;

        Ok(notes)
    }
}
