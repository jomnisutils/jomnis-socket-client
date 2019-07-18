import { HandlerCallback } from "./types"
import { SocketRequest } from "./SocketRequest"
import { SocketMessage } from "./SocketMessage"

/**
 * Abstract class with the common functionalities for both the socket kind
 */
export abstract class AbstractSocketClient {
    protected callbacks: Map<string, HandlerCallback>
    public constructor() {
        this.callbacks = new Map()
    }

    public abstract open(...args: any[]): void
    public abstract sendMessage(message: string, data?: any, callId?: number): void
    public abstract close(): void

    /**
     * Registers the callback for the given event
     * @param evName event name
     * @param callback function to register
     */
    public on(evName: string, callback: HandlerCallback): void {
        this.callbacks.set(evName, callback)
    }

    /**
     * Creates a request wrapper for the given message
     * @param socketMessage Original message
     */
    protected buildRequest(socketMessage: SocketMessage): SocketRequest {
        return new SocketRequest(socketMessage, this)
    }

    /**
     * Fires the event related to the given socket message
     * @param socketMessage recevied message
     */
    protected fire(socketMessage: SocketMessage): void {
        const callback = this.callbacks.get(socketMessage.name)
        if (callback) {
            let request = this.buildRequest(socketMessage)
            callback(request)
            request.ensureResponse()
        }
    }
}
