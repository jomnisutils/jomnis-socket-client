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

    private sendReturnMessage(ok: boolean, data?: any) {
        const name = `${this.message.name}_done`
        const payload = {
            status: ok,
            data: data,
        }
        this.socket.sendMessage(name, payload, this.callId)
        this.responseSent = true
    }

    /**
     * Sends the response message with the correct `callId`
     * @param data Message payload
     */
    public return(data?: any): void {
        this.sendReturnMessage(true, data)
    }

    public returnError(code: number = -1, desc: string = "", payload?: any): void {
        const data = {
            errorCode: code,
            errorMessage: desc,
            errorPayload: payload,
        }
        this.sendReturnMessage(false, data)
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
