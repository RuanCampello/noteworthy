use crate::errors::NoteError;
use rand::Rng;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::Type;
use std::fmt::Display;
use std::str::FromStr;

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

impl FromStr for Colour {
  type Err = NoteError;
  fn from_str(s: &str) -> Result<Self, Self::Err> {
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
      "random" => Colour::random(),
      _ => return Err(NoteError::InvalidColour(s.to_owned())),
    };
    Ok(colour)
  }
}

impl Display for Colour {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let str = match self {
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
    .to_string();
    write!(f, "{}", str)
  }
}

impl Serialize for Colour {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(&self.to_string())
  }
}

pub trait RandomColour {
  fn random() -> Self;
}

const COLOURS: &[Colour] = &[
  Colour::Blue,
  Colour::Cambridge,
  Colour::Melon,
  Colour::Mikado,
  Colour::Mindaro,
  Colour::Slate,
  Colour::Sunset,
  Colour::Tickle,
  Colour::Tiffany,
  Colour::Wisteria,
];

impl RandomColour for Colour {
  fn random() -> Self {
    COLOURS[rand::thread_rng().gen_range(0..COLOURS.len())].clone()
  }
}
