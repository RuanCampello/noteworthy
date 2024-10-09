import api/generate
import dotenv_gleam as dotenv
import gleam/io
import gleeunit
import gleeunit/should

pub fn main() {
  gleeunit.main()
}

pub fn generate_note_test() {
  dotenv.config_with("../../.env")

  let assert Ok(res) = generate.generate_note()
  io.debug(res)
}
