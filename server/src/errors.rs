use sea_orm::DbErr;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum NoteError {
    #[error("Note owner was not found")]
    NoteOwnerNotFound,
    #[error("Error creating note: {0}")]
    InsertError(#[from] DbErr),
}
