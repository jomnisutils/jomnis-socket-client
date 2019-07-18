import { AbstractSocketClient } from "./AbstractSocketClient"
import { HandlerCallback } from "./types"
import { SocketMessage } from "./SocketMessage"

export class SocketClient extends AbstractSocketClient {
    public wsAddress: string
    private socket: WebSocket | null

    public constructor(wsAddress: string) {
        super()
        this.wsAddress = wsAddress
        this.socket = null
    }

    public open(): void {
        this.socket = new WebSocket(this.wsAddress)

        this.socket.onopen = (): void => {
            console.info(`Yay! Connesso a ${this.wsAddress}!`)
            let message = new SocketMessage("socketReady", {}, 0)
            this.fire(message)
        }

        this.socket.onmessage = (e: any | { data: any }): void => {
            // console.info("Yay! C'è un messaggio!", e.data)
            const evData = JSON.parse(e.data)
            let callId = evData.callId !== undefined ? evData.callId : 0
            let message = new SocketMessage(evData.name, evData.data, callId)
            this.fire(message)
        }

        this.socket.onerror = (e: any | { data: any }): void => {
            console.error("Oh shit!", e.data)
            let message = new SocketMessage("socketError", e.data, 0)
            this.fire(message)
        }

        this.socket.onclose = (): void => {
            console.warn("Il server mi ha abbandonato!")
            let message = new SocketMessage("socketClose", {}, 0)
            this.fire(message)
        }
    }

    public sendMessage(message: string, data?: any): void {
        console.log(`Sending message ${message}`)
        const jsonMessage = JSON.stringify({
            name: message,
            data: data,
        })
        console.log(jsonMessage)
        if (this.socket) {
            this.socket.send(jsonMessage)
        } else {
            throw new Error("Unset socket")
        }
    }

    public close(): void {
        if (this.socket) {
            this.socket.close()
        }
    }
}
