import api/handler
import dot_env as dot
import dot_env/env
import gleam/erlang/process
import internal/cache.{Context}
import internal/queue
import mist
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()

  dot.new()
  |> dot.set_path(".env")
  |> dot.set_debug(False)
  |> dot.load

  let assert Ok(secret_key) = env.get_string("SECRET_KEY")
  let assert Ok(cache) = cache.new()
  let ctx = Context(cache)
  let handler = handler.handle_request(_, ctx)

  queue.fill(cache)

  let assert Ok(_) =
    wisp_mist.handler(handler, secret_key)
    |> mist.new
    |> mist.port(8000)
    |> mist.start_http()

  process.sleep_forever()
}
