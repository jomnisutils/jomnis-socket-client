import { ISocketClient } from "./ISocketClient"
import { HandlerCallback } from "./types"

export class SocketClient implements ISocketClient {
    public wsAddress: string
    private socket: WebSocket | null
    private callbacks: Map<string, HandlerCallback>

    public constructor(wsAddress: string) {
        this.wsAddress = wsAddress
        this.socket = null
        this.callbacks = new Map()
    }

    private fire(evName: string, evData?: any): void {
        const callback = this.callbacks.get(evName)
        if (callback) {
            callback(evData)
        }
    }

    public on(evName: string, callback: HandlerCallback): void {
        this.callbacks.set(evName, callback)
    }

    public open(): void {
        this.socket = new WebSocket(this.wsAddress)

        this.socket.onopen = (): void => {
            console.info(`Yay! Connesso a ${this.wsAddress}!`)
            this.fire("socketReady")
        }

        this.socket.onmessage = (e: any | { data: any }): void => {
            // console.info("Yay! C'è un messaggio!", e.data)
            const evData = JSON.parse(e.data)
            this.fire(evData.name, evData.data)
        }

        this.socket.onerror = (e: any | { data: any }): void => {
            console.error("Oh shit!", e.data)
            this.fire("socketError", e.data)
        }

        this.socket.onclose = (): void => {
            console.warn("Il server mi ha abbandonato!")
            this.fire("socketClose")
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
