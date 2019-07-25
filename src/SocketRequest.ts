import { AbstractSocketClient } from "./AbstractSocketClient"
import { SocketMessage } from "./SocketMessage"
import { throws } from "assert"

export class SocketRequest {
    private socket: AbstractSocketClient
    private callId: number
    private responseSent: boolean
    public message: SocketMessage
    private sysEvent: boolean

    public constructor(message: SocketMessage, sysEvent: boolean, socketClient: AbstractSocketClient) {
        this.message = message
        this.callId = message.callId
        this.socket = socketClient
        this.responseSent = false
        this.sysEvent = sysEvent
    }

    private sendReturnMessage(ok: boolean, data?: any) {
        const name = `${this.message.name}_done`
        this.socket.sendMessage(name, data, ok, this.callId)
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
     */
    public ensureResponse() {
        if (!this.responseSent && !this.sysEvent) {
            this.return()
        }
    }
}
