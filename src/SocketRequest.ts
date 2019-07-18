import { AbstractSocketClient } from "./AbstractSocketClient"
import { SocketMessage } from "./SocketMessage"

export class SocketRequest {
    private socket: AbstractSocketClient
    private callId: number
    private responseSent: boolean
    public message: SocketMessage

    public constructor(message: SocketMessage, socketClient: AbstractSocketClient) {
        this.message = message
        this.callId = message.callId
        this.socket = socketClient
        this.responseSent = false
    }

    /**
     * Sends the response message with the correct `callId`
     * @param name Message name
     * @param data Message payload
     */
    public sendMessage(name: string, data?: any): void {
        this.socket.sendMessage(name, data, this.callId)
        this.responseSent = true
    }

    /**
     * If neccessary, sends an empty response to the requeste (to clear the callId).
     * The response name is made by appending the "Done" suffix to the original event name
     */
    public ensureResponse() {
        if (!this.responseSent) {
            this.socket.sendMessage(`${this.message.name}Done`, {})
        }
    }
}
