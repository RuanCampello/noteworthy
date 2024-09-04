use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::colour::get_random_colour;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "Colour")]
pub enum Colour {
    #[sea_orm(string_value = "blue")]
    Blue,
    #[sea_orm(string_value = "cambridge")]
    Cambridge,
    #[sea_orm(string_value = "melon")]
    Melon,
    #[sea_orm(string_value = "mikado")]
    Mikado,
    #[sea_orm(string_value = "mindaro")]
    Mindaro,
    #[sea_orm(string_value = "slate")]
    Slate,
    #[sea_orm(string_value = "sunset")]
    Sunset,
    #[sea_orm(string_value = "tickle")]
    Tickle,
    #[sea_orm(string_value = "tiffany")]
    Tiffany,
    #[sea_orm(string_value = "wisteria")]
    Wisteria,
}
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "NoteFormat")]
pub enum NoteFormat {
    #[sea_orm(string_value = "full")]
    Full,
    #[sea_orm(string_value = "slim")]
    Slim,
}

impl From<String> for Colour {
    fn from(s: String) -> Self {
        match s.to_lowercase().as_str() {
            "blue" => Colour::Blue,
            "cambridge" => Colour::Cambridge,
            "melon" => Colour::Melon,
            "mikado" => Colour::Mikado,
            "mindaro" => Colour::Mindaro,
            "slate" => Colour::Slate,
            "sunset" => Colour::Sunset,
            "tickle" => Colour::Tickle,
            "tiffany" => Colour::Tiffany,
            "wisteria" => Colour::Wisteria,
            _ => get_random_colour(),
        }
    }
}
