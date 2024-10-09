import gleam/erlang/os
import gleam/http.{Post}
import gleam/http/request.{type Request}
import gleam/httpc
import gleam/io
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string
import json.{Params, RefineParams, RefineRequest, Request}
import prng/random.{random_sample}

const models = [
  "google/gemma-2-2b-it", "meta-llama/Meta-Llama-3-8B-Instruct",
  "mistralai/Mistral-7B-Instruct-v0.3",
]

const prompt: String = "Write a complete passage in the style of English literature classics,
  using formal language,
  descriptive imagery, and emotional depth. The passage MUST be fixed at
  350 characters length. Ensure the passage has a clear beginning, middle,
  and end, and does not cut off abruptly or leave sentences unfinished.
  I don't wanna know about the text, I only wanna the text itself."

fn create_generate_request() -> String {
  let temp: Float = random.float(0.7, 0.1) |> random_sample()
  let k: Int = random.int(70, 100) |> random_sample()

  let params = Params(temp, k, 0.95, True, 2, 350)

  Request(inputs: prompt, params:) |> json.encode_generate_request()
}

fn construct_request(request: String, model: Option(String)) -> Request(String) {
  let assert Ok(api_key) = os.get_env("HUGGING_FACE_KEY")
  let assert Ok(random_model) = get_model()
  let model_or_default = model |> option.unwrap(random_model)

  request.new()
  |> request.set_method(Post)
  |> request.set_host("api-inference.huggingface.co")
  |> request.set_path("/models/" <> model_or_default)
  |> request.prepend_header("content-type", "application/json")
  |> request.prepend_header("authorization", "Bearer " <> api_key)
  |> request.set_body(request)
}

pub fn generate_note() -> Result(String, String) {
  let json_request = create_generate_request()
  let request = construct_request(json_request, None)

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

const refine_prompt: String = "You have been given a passage of text that includes extra content,
  instructions, or comments.
  Your task is to extract only the passage itself, removing all
  additional text, placeholders, or comments. Also, generate a title
  to the given text. Structure the output exactly with 'title' and 'content'.
  Text to clean:\n\n"

fn get_refine_prompt(note: String) -> String {
  refine_prompt <> note
}

pub fn refine_note(note: String) {
  let prompt = note |> string.replace(prompt, "")
  let prompt_with_quotes =
    string.concat(["\"", prompt, "\""]) |> get_refine_prompt()

  let params = RefineParams(temperature: 0.2, top_p: 0.7, max_new_token: 1000)
  let json_req =
    RefineRequest(inputs: prompt_with_quotes, params:)
    |> json.encode_refine_request()

  let request =
    construct_request(json_req, Some("mistralai/Mistral-7B-Instruct-v0.3"))

  let resp_res =
    httpc.send(request)
    |> result.replace_error("Failed to the make refine request")
  use resp <- result.try(resp_res)

  case json.decode_generate_response(resp.body) {
    Ok(response) -> {
      let assert Ok(item) = list.first(response)
      Ok(string.replace(item.text, refine_prompt, ""))
    }
    Error(_) -> Error("Failed to serialize the generate response")
  }
}

pub fn extract_title_and_content(text: String) {
  let title_part =
    text
    |> string.split("Title: ")
    |> list.drop(1)
    |> list.first()
    |> result.unwrap("")

  let stop_where = string.crop(title_part, "\n")
  let title = string.replace(title_part, stop_where, "")

  let content_part =
    text
    |> string.split("Content: ")
    |> list.drop(1)
    |> list.first()
    |> result.unwrap("")

  #(title, content_part)
}

fn get_model() -> Result(String, String) {
  let models_l = models |> list.length
  let index = random.int(0, models_l) |> random_sample()

  case list.drop(models, index - 1) {
    [] -> Error("No model found at this index")
    [model, ..] -> Ok(model)
  }
}
