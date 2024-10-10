import api/handler
import dot_env as dot
import gleam/erlang/process
import gleam/io
import mist
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()

  dot.new()
  |> dot.set_path("/app/.env")
  |> dot.set_debug(False)
  |> dot.load

  let assert Ok(_) =
    wisp_mist.handler(handler.handle_request, "xdding")
    |> mist.new
    |> mist.port(8000)
    |> mist.start_http()

  io.debug("hello from glimmer!")

  process.sleep_forever()
}
