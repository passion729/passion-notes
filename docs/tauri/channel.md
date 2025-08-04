---
sidebar_position: 3
---

# Channel
[Related tauri docs](https://tauri.app/develop/calling-frontend/#channels)

The event system is designed to be a simple two way communication that is globally available in your application. Under the hood it directly evaluates JavaScript code so it might not be suitable to sending a large amount of data.

Channels are designed to be fast and deliver ordered data. They are used internally for streaming operations such as download progress, child process output and WebSocket messages.

## Basic
`Channel` must be worked with `Command`.
```rust
use tauri::ipc::Channel;

#[tauri::command]
fn dual_channel_task(

// channel is a command paramenter as same as common tauri commands parameters
// on_progress -> onProgress
// on_logs -> onLogs
// hls
    on_progress: Channel<u32>,      // 进度channel
    on_logs: Channel<String>        // 日志channel
    // hle
) -> Result<(), String> {
    
    std::thread::spawn(move || {
        for i in 0..10 {
            // 发送到进度channel
            let _ = on_progress.send(i * 10);
            
            // 发送到日志channel
            let _ = on_logs.send(format!("Processing step {}", i));
            
            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    });
    
    Ok(())
}
```

```typescript
import { invoke, Channel } from '@tauri-apps/api/core';
async function handleDualChannels() {
    // 创建两个独立的channel
    const progressChannel = new Channel();
    const logChannel = new Channel();

    // 各自设置不同的处理器
    progressChannel.onmessage = (progress) => {
        console.log('Progress:', progress + '%');
        updateProgressBar(progress);
    };

    logChannel.onmessage = (logMessage) => {
        console.log('Log:', logMessage);
        appendToLogArea(logMessage);
    };

    // bind channel to parameter
    await invoke('dual_channel_task', {
        // hls
        onProgress: progressChannel,
        onLogs: logChannel
        // hle
    });
}
```

A practical use case: a file download command.
```rust
use tauri::{AppHandle, ipc::Channel};
use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", rename_all_fields = "camelCase", tag = "event", content = "data")]
enum DownloadEvent<'a> {
  Started {
    url: &'a str,
    download_id: usize,
    content_length: usize,
  },
  Progress {
    download_id: usize,
    chunk_length: usize,
  },
  Finished {
    download_id: usize,
  },
}

#[tauri::command]
fn download(
    app: AppHandle, url: String, 
    // attention the command channel's name
    // hl
    on_event: Channel<DownloadEvent>) {
  let content_length = 1000;
  let download_id = 1;

  on_event.send(DownloadEvent::Started {
    url: &url,
    download_id,
    content_length,
  }).unwrap();

  for chunk_length in [15, 150, 35, 500, 300] {
    on_event.send(DownloadEvent::Progress {
      download_id,
      chunk_length,
    }).unwrap();
  }

  on_event.send(DownloadEvent::Finished { download_id }).unwrap();
}
```
```typescript
import { invoke, Channel } from '@tauri-apps/api/core';

type DownloadEvent =
    | {
    event: 'started';
    data: {
        url: string;
        downloadId: number;
        contentLength: number;
    };
}
    | {
    event: 'progress';
    data: {
        downloadId: number;
        chunkLength: number;
    };
}
    | {
    event: 'finished';
    data: {
        downloadId: number;
    };
};

const onEvent = new Channel<DownloadEvent>();
onEvent.onmessage = (message) => {
    console.log(`got download event ${ message.event }`);
};

await invoke('download', {
    url: 'https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-schema-generator/schemas/config.schema.json',
    // skip map the channel
    //hl
    onEvent,
});
```

## Lifecycle of channels

[//]: # (TODO)
working in progress...