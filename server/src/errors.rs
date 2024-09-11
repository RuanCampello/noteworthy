use bcrypt::BcryptError;
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

#[derive(Error, Debug)]
pub enum UserError {
    #[error("This account was not found in the database")]
    UserNotFound,
    #[error("You entered the wrong credentials")]
    InvalidCredentials,
    #[error("Error on database: {0}")]
    DatabaseError(#[from] DbErr),
    #[error("Error during decryption: {0}")]
    DecryptError(#[from] BcryptError),
    #[error("User image was not found in R2")]
    ImageNotFound,
}

#[derive(Error, Debug)]
pub enum TokenError {
    #[error("Token was not found in headers")]
    NotFound,
    #[error("Token format provided is invalid")]
    InvalidFormat,
}
