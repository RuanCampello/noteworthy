import dot_env/env
import gleam/http.{Post}
import gleam/http/request.{type Request}
import gleam/httpc
import gleam/list
import gleam/result
import gleam/string
import json.{Params, Request}

const prompt: String = "Write a passage in the style of classic English literature with formal language and emotional depth.
Structure it with a clear beginning, middle, and end. Please ensure it is complete and not truncated.
Return using the structure of 'title:' and 'content:' only, no more comment about the text."

const params = Params(0.8, 250, 2, True)

fn construct_request() -> Request(String) {
  let assert Ok(api_key) = env.get_string("HUGGING_FACE_KEY")
  let model = "meta-llama/Llama-3.2-3B-Instruct"
  let request =
    Request(inputs: prompt, params:) |> json.encode_generate_request()

  request.new()
  |> request.set_method(Post)
  |> request.set_host("api-inference.huggingface.co")
  |> request.set_path("/models/" <> model)
  |> request.prepend_header("content-type", "application/json")
  |> request.prepend_header("x-use-cache", "false")
  |> request.prepend_header("authorization", "Bearer " <> api_key)
  |> request.set_body(request)
}

pub fn generate_note() -> Result(String, String) {
  let request = construct_request()

  let resp_res =
    httpc.send(request) |> result.replace_error("Failed to the make request")
  use resp <- result.try(resp_res)

  case json.decode_generate_response(resp.body) {
    Ok(res) -> {
      case res {
        [first] -> Ok(first.text)
        _ -> Error("Request did not returned any item")
      }
    }
    Error(_) -> Error("Failed to deserialize the response")
  }
}

pub fn extract_title_and_content(text: String) {
  let title_part =
    text
    |> string.split("title: ")
    |> list.drop(1)
    |> list.first()
    |> result.unwrap("")
  // Removes the extra text after the title.
  let stop_where = string.crop(title_part, "\n")
  let title = string.replace(title_part, stop_where, "")

  let content_part =
    text
    |> string.split("content: ")
    |> list.drop(1)
    |> list.first()
    |> result.unwrap("")

  // Removes the remaining text if it does not ends with a period, which would be an unfinished text segment.
  let parts = string.split(content_part, ".")
  let len = list.length(parts)
  let content = case len {
    0 | 1 -> content_part
    _ -> list.take(parts, len - 1) |> string.join(".") |> string.append(".")
  }

  let trimmed_content = content |> string.replace("\n", " ") |> string.trim()

  #(title, trimmed_content)
}
