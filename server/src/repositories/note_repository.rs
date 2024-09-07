use sea_orm::{
    prelude::Uuid, ActiveModelTrait, ActiveValue, ColumnTrait, DatabaseConnection, EntityTrait,
    QueryFilter,
};
use std::sync::Arc;

use crate::{
    controllers::note_controller::{ColourOption, CreateNoteRequest},
    errors::NoteError,
    models::{
        notes::{self, Entity as Note},
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
}
