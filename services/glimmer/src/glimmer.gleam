import api/generate.{generate_note}
import dotenv_gleam as dotenv
import gleam/io

pub fn main() {
  dotenv.config_with("../../.env")

  io.println("Hello from glimmer!")
  generate_note()
}
