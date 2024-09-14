use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::{Encode, Type};
use crate::utils::colour::get_random_colour;

#[derive(Deserialize, Debug, Clone, PartialEq, Eq, Type)]
pub enum Colour {
  Blue,
  Cambridge,
  Melon,
  Mikado,
  Mindaro,
  Slate,
  Sunset,
  Tickle,
  Tiffany,
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

impl From<&str> for Colour {
  fn from(s: &str) -> Self {
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

impl Serialize for Colour {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    let color_string = match self {
      Colour::Blue => "blue",
      Colour::Cambridge => "cambridge",
      Colour::Melon => "melon",
      Colour::Mikado => "mikado",
      Colour::Mindaro => "mindaro",
      Colour::Slate => "slate",
      Colour::Sunset => "sunset",
      Colour::Tickle => "tickle",
      Colour::Tiffany => "tiffany",
      Colour::Wisteria => "wisteria",
    };
    serializer.serialize_str(color_string)
  }
}

impl Colour {
  pub fn colour_name(&self) -> &'static str {
    match self {
      Colour::Blue => "blue",
      Colour::Cambridge => "cambridge",
      Colour::Melon => "melon",
      Colour::Mikado => "mikado",
      Colour::Mindaro => "mindaro",
      Colour::Slate => "slate",
      Colour::Sunset => "sunset",
      Colour::Tickle => "tickle",
      Colour::Tiffany => "tiffany",
      Colour::Wisteria => "wisteria",
    }
  }
}
