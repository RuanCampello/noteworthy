use sea_orm::{prelude::Uuid, DbErr};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum NoteError {
    #[error("User with id {0} was not found")]
    NoteOwnerNotFound(String),
    #[error("Note with given id {0} was not found")]
    NoteNotFound(Uuid),
    #[error("Error creating note: {0}")]
    InsertError(#[from] DbErr),
}
