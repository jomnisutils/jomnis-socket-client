# JOmnisSocketClient

This simple library contains a wrapper class for the `jOmnis` object exposed from the Omnis Studio htmlcontrols framework which can also work with a standard W3C WebSocket to ease the development phase.

## Install

```
npm install --save jomnis-socket-client
```

## Usage

```typescript
import { JOmnis, SocketClient, AbstractSocketClient, OmnisSocketClient } from "jomnis-socket-client"

declare var jOmnis: JOmnis // JOmnis has to be globally available

const isOmnis: boolean = /* ... */

const socketClient: AbstractSocketClient = isOmnis ? new OmnisSocketClient(jOmnis) : new SocketClient(/* mock server address*/)

socketClient.on("socketReady", (request) => {
    request.sendMessage("evAppReady")
})

socketClient.on("someMethodCall", (request) => {
    // do stuff
    request.sendMessage("someMethodCall_done")
})

```

## TODO list

-   A better example
-   A better `JOmnis` type declaration
