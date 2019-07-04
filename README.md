# JOmnisSocketClient

This simple library contains a wrapper class for the `jOmnis` object exposed from the Omnis Studio htmlcontrols framework which can also work with a standard W3C WebSocket to ease the development phase.

## Usage

```typescript
import { JOmnis, SocketClient, ISocketClient, OmnisSocketClient } from "jomnis-socket-client"

declare var jOmnis: JOmnis // JOmnis has to be globally available

const isOmnis: boolean = /* ...*/

const socketClient: ISocketClient = isOmnis ? new OmnisSocketClient(jOmnis) : new SocketClient(/* mock server address*/)

socketClient.on("socketReady", () => {
    socketClient.sendMessage("evAppReady")
})
```

## TODO list

-   A better example
-   A better `JOmnis` type declaration
