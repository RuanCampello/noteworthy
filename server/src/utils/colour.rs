use rand::Rng;

use crate::models::sea_orm_active_enums::Colour;

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

pub fn get_random_colour() -> Colour {
  COLOURS[rand::thread_rng().gen_range(0..COLOURS.len())].clone()
}
