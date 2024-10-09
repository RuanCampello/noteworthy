import gleam/dynamic
import gleam/json.{array, bool, float, int, string}
import gleam/list
import gleam/result

pub type GenerateText {
  GenerateText(text: String)
}

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

/// Decode the response from API.
//pub fn decode_generate_response(
//  json: String,
//) -> Result(GenerateTextResponse, json.DecodeError) {
//  let decoder =
//    dynamic.decode1(
//      GenerateTextResponse,
//      dynamic.field("generated_text", dynamic.list),
//    )
//
//  use res_list <- result.try(json.decode(from: json, using: decoder))
//  list.first(res_list)
//}

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
    top_k: Int,
    top_p: Float,
    do_samp: Bool,
    no_repeat_ngram_size: Int,
    max_new_token: Int,
  )
}

/// Structure of Hugging face's API request.
pub type Request {
  Request(inputs: String, params: Params)
}

/// Encodes the request to Hugging face's API to JSON.
pub fn encode_generate_request(req: Request) -> String {
  let params = encode_params(req.params)

  json.object([#("inputs", string(req.inputs))])
  |> json.to_string()
}

pub fn encode_params(p: Params) -> String {
  json.object([
    #("temperature", float(p.temperature)),
    //    #("top_k", int(p.top_k)),
  //    #("top_p", float(p.top_p)),
  //    #("do_samp", bool(p.do_samp)),
  //    #("no_repeat_ngram_size", int(p.no_repeat_ngram_size)),
  //    #("max_new_token", int(p.max_new_token)),
  ])
  |> json.to_string()
}
