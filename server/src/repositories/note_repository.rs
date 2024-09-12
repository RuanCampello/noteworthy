use chrono::Local;
use sea_orm::{
    prelude::{Expr, Uuid},
    ActiveModelTrait, ActiveValue, ColumnTrait, DatabaseConnection, DbBackend, EntityTrait,
    FromQueryResult, QueryFilter, QueryOrder, QuerySelect, Set, Statement,
};
use std::sync::Arc;

use crate::{
    controllers::note_controller::{ColourOption, CreateNoteRequest, UpdateNoteRequest},
    errors::NoteError,
    models::{
        notes::{self, Column as NoteColumn, Entity as Note},
        sea_orm_active_enums::Colour,
        users::Entity as User,
    },
};

#[derive(Clone)]
pub struct NoteRepository {
    database: Arc<DatabaseConnection>,
}

impl NoteRepository {
    pub fn new(database: &Arc<DatabaseConnection>) -> Self {
        Self {
            database: Arc::clone(database),
        }
    }

    pub async fn new_note(
        &self,
        req: &CreateNoteRequest,
        user_id: &str,
    ) -> Result<Uuid, NoteError> {
        let colour = match &req.colour {
            ColourOption::Colour(c) => Colour::from(c.as_str()),
        };

        let user = match User::find_by_id(user_id).one(&*self.database).await? {
            Some(user) => user,
            None => return Err(NoteError::NoteOwnerNotFound(user_id.to_owned())),
        };

        let note = notes::ActiveModel {
            title: Set(req.title.to_owned()),
            content: Set(req.content.to_owned().unwrap_or_else(|| String::new())),
            colour: Set(colour),
            user_id: Set(user.id),
            created_at: Set(Local::now().naive_local()),
            last_update: Set(Local::now().naive_local()),
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
            .filter(NoteColumn::UserId.eq(user_id))
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
            .filter(NoteColumn::UserId.eq(user_id))
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
    ) -> Result<notes::NoteWithUserPrefs, NoteError> {
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

        let result = notes::NoteWithUserPrefs::find_by_statement(Statement::from_sql_and_values(
            DbBackend::Postgres,
            query,
            [id.into(), user_id.into()],
        ))
        .one(self.database.as_ref())
        .await?
        .unwrap();

        Ok(result)
    }

    pub async fn find_all_user_notes(
        &self,
        user_id: &str,
        is_fav: bool,
        is_arc: bool,
    ) -> Result<Vec<notes::PartialNote>, NoteError> {
        let notes = Note::find()
            .filter(NoteColumn::UserId.eq(user_id))
            .filter(NoteColumn::IsFavourite.eq(is_fav))
            .filter(NoteColumn::IsArchived.eq(is_arc))
            .select_only()
            .expr_as(Expr::cust("LEFT(content, 250)"), "content")
            .columns([
                NoteColumn::Id,
                NoteColumn::Title,
                NoteColumn::Colour,
                NoteColumn::CreatedAt,
            ])
            .order_by_desc(NoteColumn::LastUpdate)
            .into_model::<notes::PartialNote>()
            .all(&*self.database)
            .await?;
        Ok(notes)
    }

    pub async fn edit_note_content(
        &self,
        id: Uuid,
        user_id: &str,
        content: String,
    ) -> Result<(), NoteError> {
        let note = match Note::find_by_id(id)
            .filter(NoteColumn::UserId.eq(user_id))
            .one(&*self.database)
            .await?
        {
            Some(note) => note,
            None => return Err(NoteError::NoteNotFound(id)),
        };

        let mut note: notes::ActiveModel = note.into();
        note.content = Set(content);
        note.last_update = Set(Local::now().naive_local());
        note.update(&*self.database).await?;

        Ok(())
    }
}
