import api/generate
import dotenv_gleam as dotenv
import gleam/io
import gleam/result
import gleeunit
import gleeunit/should

pub fn main() {
  gleeunit.main()
}

//pub fn generate_note_test() {
//  dotenv.config_with("../../.env")
//
//  let assert Ok(res) = generate.generate_note()
//}
//
//pub fn refine_note_test() {
//  dotenv.config_with("../../.env")
//  let assert Ok(res) = generate.generate_note()
//
//  let refined_res = generate.refine_note(res)
//  io.debug(refined_res)
//}

pub fn extract_title_content_test() {
  dotenv.config_with("../../.env")
  let assert Ok(res) = generate.generate_note()
  let assert Ok(refined_result) = generate.refine_note(res)

  io.debug(refined_result)

  let res = generate.extract_title_and_content(refined_result)

  io.debug(res)
  //  io.print(content)
}
