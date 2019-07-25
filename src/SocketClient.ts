import { AbstractSocketClient } from "./AbstractSocketClient"
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
            this.fire(message, true)
        }

        this.socket.onmessage = (e: any | { data: any }): void => {
            // console.info("Yay! C'è un messaggio!", e.data)
            const evData = JSON.parse(e.data)
            let callId = evData.callId !== undefined ? evData.callId : 0
            let message = new SocketMessage(evData.name, evData.data, callId)
            this.fire(message, false)
        }

        this.socket.onerror = (e: any | { data: any }): void => {
            console.error("Oh shit!", e.data)
            let message = new SocketMessage("socketError", e.data, 0)
            this.fire(message, true)
        }

        this.socket.onclose = (): void => {
            console.warn("Il server mi ha abbandonato!")
            let message = new SocketMessage("socketClose", {}, 0)
            this.fire(message, true)
        }
    }

    public sendMessage(name: string, data: any = {}, status: boolean = true, callId: number = 0): void {
        const event = JSON.stringify({
            name,
            data: data,
            callId,
            status,
        })
        console.info(`Sending ${name}`, event)
        if (this.socket) {
            this.socket.send(event)
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
