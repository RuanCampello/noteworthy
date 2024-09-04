use sea_orm::{prelude::Uuid, ActiveModelTrait, ActiveValue, DatabaseConnection, EntityTrait};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::{
    errors::NoteError,
    models::{notes, sea_orm_active_enums::Colour, users::Entity as User},
};

#[derive(Clone)]
pub struct NoteRepository {
    database: Arc<DatabaseConnection>,
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum ColourOption {
    Colour(String),
}

impl NoteRepository {
    pub fn new(database: Arc<DatabaseConnection>) -> Self {
        Self { database }
    }

    pub async fn new_note(
        &self,
        user_id: String,
        title: String,
        content: Option<String>,
        colour_opt: ColourOption,
    ) -> Result<Uuid, NoteError> {
        let colour = match colour_opt {
            ColourOption::Colour(c) => Colour::from(c),
        };

        let user = User::find_by_id(user_id)
            .one(&*self.database)
            .await
            .map_err(|_| NoteError::NoteOwnerNotFound)?;

        let user_id = match user {
            Some(user) => user.id,
            None => return Err(NoteError::NoteOwnerNotFound),
        };

        let note = notes::ActiveModel {
            title: ActiveValue::set(title),
            content: ActiveValue::set(content.unwrap_or_else(|| String::new())),
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
}
