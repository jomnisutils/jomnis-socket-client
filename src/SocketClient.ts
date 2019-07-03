import { ISocketClient } from "./ISocketClient"
import { HandlerCallback } from "./types"

export class SocketClient implements ISocketClient {
    wsAddress: string
    socket: WebSocket | null
    callbacks: Map<string, HandlerCallback>

    constructor(wsAddress: string) {
        this.wsAddress = wsAddress
        this.socket = null
        this.callbacks = new Map()
    }

    private fire(evName: string, evData?: any) {
        const callback = this.callbacks.get(evName)
        if (callback) {
            callback(evData)
        }
    }

    on(evName: string, callback: HandlerCallback) {
        this.callbacks.set(evName, callback)
    }

    open() {
        this.socket = new WebSocket(this.wsAddress)

        this.socket.onopen = () => {
            console.info(`Yay! Connesso a ${this.wsAddress}!`)
            this.fire("socketReady")
        }

        this.socket.onmessage = (e: any | { data: any }) => {
            // console.info("Yay! C'è un messaggio!", e.data)
            const evData = JSON.parse(e.data)
            this.fire(evData.name, evData.data)
        }

        this.socket.onerror = (e: any | { data: any }) => {
            console.error("Oh shit!", e.data)
            this.fire("socketError", e.data)
        }

        this.socket.onclose = () => {
            console.warn("Il server mi ha abbandonato!")
            this.fire("socketClose")
        }
    }

    sendMessage(message: string, data?: any) {
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

    close() {
        if (this.socket) {
            this.socket.close()
        }
    }
}
