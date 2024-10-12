import gleam/io
import gleam/json as gleam_json
import gleam/list
import gleam/result
import gleam/string
import internal/cache.{type Context}
import internal/queue
import json
import wisp.{type Request, type Response}

/// Route the request to their appropriate handler based on the path.
pub fn handle_request(req: Request, ctx: Context) -> Response {
  case wisp.path_segments(req) {
    [] -> wisp.ok()
    ["generate"] -> generate_note_handler(ctx)
    _ -> wisp.not_found()
  }
}

fn fetch_generate_note(ctx: Context) {
  case queue.get_first(ctx.queue_cache) {
    Ok(response) -> {
      let title_and_content = response |> string.split("###")
      let title = title_and_content |> list.first() |> result.unwrap("")
      let content = title_and_content |> list.last() |> result.unwrap("")
      Ok(json.encode_generate_note_response(title, content))
    }
    Error(_) -> {
      Error("Nothing in the queue")
    }
  }
}

fn generate_note_handler(ctx: Context) {
  case fetch_generate_note(ctx) {
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
