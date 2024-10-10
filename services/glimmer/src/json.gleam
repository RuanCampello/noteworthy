//// This module contains the serialization/deserialization of the API requests and responses to JSON.

import gleam/dynamic
import gleam/json.{bool, float, int, string}

pub type GenerateText {
  GenerateText(text: String)
}

/// Decode the generate response from API.
pub type GenerateTextResponse {
  GenerateTextResponse(List(GenerateText))
}

pub fn decode_generate_response(json: String) {
  let decoder = dynamic.list(decode_generated_text())

  json.decode(json, using: decoder)
}

pub fn decode_generated_text() {
  dynamic.decode1(GenerateText, dynamic.field("generated_text", dynamic.string))
}

/// Generate route JSON response.
pub type GenerateResponse {
  GenerateResponse(title: String, content: String)
}

pub fn decode_refine_response(
  json: String,
) -> Result(GenerateResponse, json.DecodeError) {
  let decoder =
    dynamic.decode2(
      GenerateResponse,
      dynamic.field("title", of: dynamic.string),
      dynamic.field("content", of: dynamic.string),
    )

  json.decode(from: json, using: decoder)
}

/// Params of text-generation AI.
pub type Params {
  Params(
    temperature: Float,
    max_new_tokens: Int,
    no_repeat_ngram_size: Int,
    return_full_text: Bool,
  )
}

/// Structure of Hugging face's API request.
pub type Request {
  Request(inputs: String, params: Params)
}

/// Encodes the request to Hugging face's API to JSON.
pub fn encode_generate_request(req: Request) -> String {
  json.object([
    #("inputs", string(req.inputs)),
    #("parameters", encode_params(req.params)),
  ])
  |> json.to_string()
}

/// Encodes the params of the request.
/// See https://huggingface.co/docs/api-inference/en/tasks/text-generation for more details.
pub fn encode_params(p: Params) -> json.Json {
  json.object([
    #("temperature", float(p.temperature)),
    #("max_new_tokens", int(p.max_new_tokens)),
    #("no_repeat_ngram_size", int(p.no_repeat_ngram_size)),
    #("return_full_text", bool(p.return_full_text)),
  ])
}

/// Encodes the already clean generated note to JSON.
pub fn encode_generate_note_response(
  title: String,
  content: String,
) -> json.Json {
  json.object([#("title", string(title)), #("content", string(content))])
}
