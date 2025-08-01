---
sidebar_position: 1
---

# Command
[Related tauri docs](https://tauri.app/develop/calling-rust/)
## Basic
Just add a function and annotate it with `#[tauri::command]`:
```rust title="src-tauri/src/lib.rs"
// hl
#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}
```

And register command into builder:
```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    // hl
    .invoke_handler(tauri::generate_handler![my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

:::note
- When defining commands in a separate module they should be marked as `pub`.
- But while a command is defined in `lib.rs`, it cannot be marked as `pub`.
- The command name must be unique.
:::

Invoke in JS:
```typescript
// When using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/core';

// Invoke the command
invoke('my_custom_command');
```

## Command with arguments
Arguments can be of any type, as long as they implement `serde::Deserialize`.

```rust
#[tauri::command]
fn my_custom_command(invoke_message: String) {
  println!("I was invoked from JavaScript, with this message: {}", invoke_message);
}
```
```typescript
// Arguments should be passed as a JSON object with camelCase keys
// invoke_message -> invokeMessage
invoke('my_custom_command', { invokeMessage: 'Hello!' });
```
:::note[Use snake case keys]
```rust
// hl
#[tauri::command(rename_all = "snake_case")]
fn my_custom_command(invoke_message: String) {}
```
```typescript
invoke('my_custom_command', { invoke_message: 'Hello!' });
```
:::

## Command with return data
Everything returned from commands must implement `serde::Serialize`.
```rust
#[tauri::command]
fn my_custom_command() -> String {
  "Hello from Rust!".into()
}
```
```typescript
invoke('my_custom_command').then((message) => console.log(message));
```

## Command return array buffers
**_Do not use simple data above._**

Return values that implements `serde::Serialize` are serialized to JSON when the response is sent to the frontend. This can slow down your application if you try to return a large data such as a file or a download HTTP response. To return array buffers in an optimized way, use `tauri::ipc::Response`.
```rust
use tauri::ipc::Response;
#[tauri::command]
fn read_file() -> Response {
  let data = std::fs::read("/path/to/file").unwrap();
  tauri::ipc::Response::new(data)
}
```

## Return an error handling
```rust
#[tauri::command]
fn login(user: String, password: String) -> Result<String, String> {
  if user == "tauri" && password == "tauri" {
    // resolve
    Ok("logged_in".to_string())
  } else {
    // reject
    Err("invalid credentials".to_string())
  }
}
```
```typescript
invoke('login', { user: 'tauri', password: '0j4rijw8=' })
  .then((message) => console.log(message))
  .catch((error) => console.error(error));
```
But the problem is, everything returned from commands must implement `serde::Serialize`, including errors, if working with error types from Rust’s std library or external crates as most error types do not implement it. We need to create our own error type which implements `serde::Serialize`.
```rust
// create the error type that represents all errors possible in our program
// thiserror::Error trait helps to turn enums into error types
#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error("failed to parse as string: {0}")]
  Utf8(#[from] std::str::Utf8Error),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
  Io(String),
  Utf8(String),
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    let error_message = self.to_string();
    let error_kind = match self {
      Self::Io(_) => ErrorKind::Io(error_message),
      Self::Utf8(_) => ErrorKind::Utf8(error_message),
    };
    error_kind.serialize(serializer)
  }
}

#[tauri::command]
fn read() -> Result<Vec<u8>, Error> {
  let data = std::fs::read("/path/to/file")?;
  Ok(data)
}
```
```typescript
// in JS, we now get a { kind: 'io' | 'utf8', message: string } error object
type ErrorKind = {
  kind: 'io' | 'utf8';
  message: string;
};

invoke('read').catch((e: ErrorKind) => {});
```

## Async commands
Asynchronous commands are preferred in Tauri to perform heavy work in a manner that doesn’t result in UI freezes or slowdowns.

Async commands are executed on a separate async task using `async_runtime::spawn`. Commands without the async keyword are executed on the _**main thread**_ unless defined with `#[tauri::command(async)]`.

:::warning
Need to be careful when creating asynchronous functions using Tauri. Currently, you cannot simply include borrowed arguments in the signature of an asynchronous function. Some common examples of types like this are `&str` and `State<'_, Data>`. This limitation is tracked here: https://github.com/tauri-apps/tauri/issues/2533 and workarounds are shown below.
:::

**Option 1**: Convert the type, such as `&str` to a similar type that is not borrowed, such as `String`. This may not work for all types, for example `State<'_, Data>`.

**Option 2**: Wrap the return type in a Result. This one is a bit harder to implement, but works for all types. The same like [Return an error handling](./command#return-an-error-handling).
```rust
// Return a Result<String, ()> to bypass the borrowing issue, and return no error
#[tauri::command]
async fn my_custom_command(value: &str) -> Result<String, ()> {
  // Call another async function and wait for it to finish
  some_async_function().await;
  // Note that the return value must be wrapped in `Ok()` now.
  Ok(format!(value))
}
```
Since invoking the command from JavaScript already returns a promise, it works just like any other command.
```typescript
invoke('my_custom_command', { value: 'Hello, Async!' }).then(() =>
  console.log('Completed!')
);
```