# JOmnisSocketClient

This simple library contains a wrapper class for the `jOmnis` object exposed from the Omnis Studio htmlcontrols framework which can also work with a standard W3C WebSocket to ease the development phase.

## Usage

```typescript
import {  SocketClient, ISocketClient, OmnisSocketClient } from "jomnis-socket-client"

const isOmnis: boolean = /* ...*/

const socketClient: ISocketClient = isOmnis ? new OmnisSocketClient(jOmnis) : new SocketClient(/* mock server address*/)

socketClient.on("socketReady", () => {
    socketClient.sendMessage("evAppReady")
})
```
