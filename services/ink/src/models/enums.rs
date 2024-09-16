use crate::errors::NoteError;
use crate::utils::colour::get_random_colour;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::Type;

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
#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize)]
pub enum NoteFormat {
  Full,
  Slim,
}

#[derive(Deserialize)]
pub enum SearchFilter {
  Favourites,
  Archived,
}

impl Colour {
  pub fn from_str(s: &str) -> Result<Self, NoteError> {
    let colour = match s.to_lowercase().as_str() {
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
      "random" => get_random_colour(),
      _ => return Err(NoteError::InvalidColour(s.to_owned())),
    };
    Ok(colour)
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
