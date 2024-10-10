import gleam/io
import gleam/json as gleam_json
import gleam/result
import internal/generate
import json
import wisp.{type Request, type Response}

/// Route the request to their appropriate handler based on the path.
pub fn handle_request(req: Request) -> Response {
  case wisp.path_segments(req) {
    [] -> wisp.ok()
    ["generate"] -> generate_note_handler()
    _ -> wisp.not_found()
  }
}

fn fetch_generate_note() {
  use note <- result.try(generate.generate_note())

  let title_and_content = generate.extract_title_and_content(note)

  io.debug(title_and_content)

  let response =
    json.encode_generate_note_response(title_and_content.0, title_and_content.1)

  Ok(response)
}

fn generate_note_handler() {
  case fetch_generate_note() {
    Ok(response) -> {
      response |> gleam_json.to_string_builder() |> wisp.json_response(200)
    }
    Error(err) -> {
      io.println_error(err)
      error_response("Something went wrong!")
    }
  }
}

/// Create an error response from a message.
fn error_response(msg: String) -> Response {
  gleam_json.object([#("error", gleam_json.string(msg))])
  |> gleam_json.to_string_builder
  |> wisp.json_response(500)
}
