import gleam/erlang/os
import gleam/int
import gleam/io
import gleam/list
import prng/random.{random_sample}

type Params {
  Params(
    temperature: Float,
    top_k: Int,
    top_p: Float,
    do_samp: Bool,
    no_repeat_ngram_size: Int,
    max_new_token: Int,
  )
}

type Request {
  Request(input: String, params: Params)
}

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

fn create_request() -> Request {
  let temp: Float = random.float(0.7, 0.1) |> random_sample()
  let k: Int = random.int(10, 100) |> random_sample()

  let params = Params(temp, k, 0.95, True, 2, 350)

  Request(input: prompt, params:)
}

pub fn generate_note() {
  let assert Ok(api_key) = os.get_env("HUGGING_FACE_KEY")
  let assert Ok(model) = models |> get_model()

  let req = create_request()
  let api_url = "https://api-inference.huggingface.co/models" <> model

  io.print(api_url)
}

fn get_model(models: List(String)) -> Result(String, String) {
  let models_l = models |> list.length
  let index = random.int(0, models_l) |> random_sample()

  io.debug("Index" <> index |> int.to_string())

  case list.drop(models, index - 1) {
    [] -> Error("No model found at this index")
    [model, ..] -> Ok(model)
  }
}
