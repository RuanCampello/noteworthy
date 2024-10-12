//// This module is meant to manage the cache queue and its state.

import gleam/erlang/process
import gleam/int
import gleam/io
import gleam/list
import gleam/otp/task
import gleam/string
import internal/cache.{type Cache}
import internal/generate

/// Tries to add an element to the end of the queue stored in the cache.
/// If the queue is full (i.e., already contains 10 elements), do nothing.
pub fn insert(cache: Cache(String), element: String) {
  let keys = cache.get_keys(cache)
  case list.length(keys) {
    //    10 -> process.send(cache, Nil)
    // Do nothing if the queue is full
    _ -> {
      let new_key = list.length(keys) |> int.to_string()
      cache.set(cache, new_key, element)
    }
  }
}

/// Gets and removes the first element from the queue stored in the cache.
/// If the queue is empty, return an error.
pub fn get_first(cache: Cache(String)) -> Result(String, Nil) {
  let keys = cache.get_keys(cache)
  case keys {
    [first, ..rest] -> {
      let value = cache.get(cache, first)
      case value {
        Ok(element) -> {
          io.print("got value" <> first)

          // re-insert remaining elements with updated keys
          rest
          |> list.index_map(fn(_value, key) {
            case cache.get(cache, int.to_string(key)) {
              Ok(v) -> {
                cache.delete(cache, int.to_string(key))
                // remove old key
                insert(cache, v)
              }
              _ -> {
                Nil
              }
            }
          })

          Ok(element)
        }
        _ -> Error(Nil)
      }
    }

    // queue is empty, return an error
    _ -> Error(Nil)
  }
}

pub fn fill(cache: Cache(String)) {
  task.async(fn() { fill_queue(cache) })
}

/// Fills the queue with generated notes until the queue is full.
fn fill_queue(cache: Cache(String)) {
  let keys = cache.get_keys(cache)

  io.debug(list.length(keys))

  case list.length(keys) {
    len if len < 3 -> {
      // tries to generate a note
      case generate.generate_note() {
        Ok(note) -> {
          let result = generate.extract_title_and_content(note)

          case result {
            #(title, content) -> {
              case title, content {
                "", _ -> {
                  io.debug("Note has no title")
                  Nil
                }
                _, "" -> {
                  io.debug("Note has no content")
                  Nil
                }
                _, _ -> {
                  let title_and_content = string.concat([title, "###", content])
                  insert(cache, title_and_content)
                  io.debug("Note added to the queue: " <> title_and_content)
                  Nil
                }
              }
            }
          }
        }
        Error(_) -> {
          io.debug("Failed to generate a note")
          Nil
        }
      }
    }
    _ -> {
      // io.debug("Queue is full...")
      Nil
    }
  }

  process.sleep(500)
  fill_queue(cache)
}
