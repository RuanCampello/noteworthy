//// This module provides a in-memory simple key-value store.

import gleam/dict.{type Dict}
import gleam/erlang/process.{type Subject}
import gleam/otp/actor

const timeout = 604_800

type Store(value) =
  Dict(String, value)

/// Alias to interact with the cache actor.
pub type Cache(value) =
  Subject(Message(value))

/// Simple alias to provide access to caches through the requests.
pub type Context {
  Context(queue_cache: Cache(String))
}

pub type Message(value) {
  Set(key: String, value: value)
  Get(reply_with: Subject(Result(value, Nil)), key: String)
  GetKeys(reply_with: Subject(List(String)))
  Delete(key: String)
  Continue
  Shutdown
}

/// The messages that can be sent to the cache actor.
fn handle_message(
  message: Message(value),
  store: Store(value),
) -> actor.Next(Message(value), Store(value)) {
  case message {
    Set(key, value) -> store |> dict.insert(key, value) |> actor.continue()
    Get(client, key) -> {
      process.send(client, dict.get(store, key))
      actor.continue(store)
    }
    GetKeys(client) -> {
      process.send(client, dict.keys(store))
      actor.continue(store)
    }
    Delete(key) -> store |> dict.delete(key) |> actor.continue()
    Continue -> actor.continue(store)
    Shutdown -> actor.Stop(process.Normal)
  }
}

pub fn new() -> Result(Subject(Message(value)), actor.StartError) {
  actor.start(dict.new(), handle_message)
}

pub fn set(cache: Cache(value), key: String, value: value) {
  process.send(cache, Set(key, value))
}

pub fn get(cache: Cache(value), key: String) -> Result(value, Nil) {
  actor.call(cache, Get(_, key), timeout)
}

pub fn get_keys(cache: Cache(value)) -> List(String) {
  actor.call(cache, GetKeys, timeout)
}

pub fn delete(cache: Cache(value), key: String) {
  process.send(cache, Delete(key))
}

pub fn shutdown(cache: Cache(value)) {
  process.send(cache, Shutdown)
}
