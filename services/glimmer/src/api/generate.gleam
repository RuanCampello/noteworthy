import gleam/erlang/os
import gleam/http.{Post}
import gleam/http/request
import gleam/httpc
import gleam/io
import gleam/list
import gleam/result
import json.{Params, Request}
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

fn create_request() -> String {
  let temp: Float = random.float(0.7, 0.1) |> random_sample()
  let k: Int = random.int(10, 100) |> random_sample()

  let params = Params(temp, k, 0.95, True, 2, 350)

  Request(inputs: prompt, params:) |> json.encode_generate_request
}

pub fn generate_note() -> Result(String, String) {
  let assert Ok(api_key) = os.get_env("HUGGING_FACE_KEY")
  let assert Ok(model) = models |> get_model()
  let json_request = create_request()

  let request =
    request.new()
    |> request.set_method(Post)
    |> request.set_host("api-inference.huggingface.co")
    |> request.set_path("/models/" <> model)
    |> request.prepend_header("content-type", "application/json")
    |> request.prepend_header("authorization", "Bearer " <> api_key)
    |> request.set_body(json_request)

  let resp_res =
    httpc.send(request) |> result.replace_error("Failed to the make request")
  use resp <- result.try(resp_res)

  case json.decode_generate_response(resp.body) {
    Ok(res) -> {
      let assert Ok(item) = list.first(res)
      Ok(item.text)
    }
    Error(_) -> Error("Failed to deserialize the response")
  }
}

fn get_model(models: List(String)) -> Result(String, String) {
  let models_l = models |> list.length
  let index = random.int(0, models_l) |> random_sample()

  case list.drop(models, index - 1) {
    [] -> Error("No model found at this index")
    [model, ..] -> Ok(model)
  }
}
