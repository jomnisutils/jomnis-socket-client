import { AbstractSocketClient } from "./AbstractSocketClient"
import { HandlerCallback, JOmnis } from "./types"
import { SocketMessage } from "./SocketMessage"

declare type JOmnisHandlerCallback = (data: string) => void

/**
 * The `jOmins` wrapper, it impleents the `callbackObject` requested from the
 * Omnis html_controls framework.
 */
export class OmnisSocketClient extends AbstractSocketClient {
    private socket: JOmnis
    private callbackObject: { [message: string]: JOmnisHandlerCallback }

    public constructor(omnisSocket: JOmnis) {
        super()
        this.socket = omnisSocket
        // Standard callback object
        this.callbackObject = {
            omnisOnLoad: (): void => {
                console.info("omnisOnLoad")
            },
            omnisOnWebSocketOpened: (): void => {
                console.info("omnisOnWebSocketOpened")
                let socketReadyMessage = new SocketMessage("socketReady", {}, 0)
                this.fire(socketReadyMessage, true)
            },
            test: (data: string): void => {
                console.log("TEST!")
                console.log(data)
            },
        }
    }

    public on(messageName: string, handler: HandlerCallback): void {
        super.on(messageName, handler)

        this.callbackObject[messageName] = (evData: string): void => {
            const parsedData = JSON.parse(evData)
            console.log(`MSG from JOmnis ${messageName}`, evData, parsedData)

            const parsedPayload = JSON.parse(parsedData.payload)
            const callId = parsedData.callId

            this.fire(new SocketMessage(messageName, parsedPayload, callId), false)
        }
    }

    public open(): void {
        if (this.socket.callbackHotSwap) {
            this.socket.callbackHotSwap(this.callbackObject)
        } else {
            this.socket.callbackObject = this.callbackObject
        }
    }

    public sendMessage(name: string, data: any = {}, callId: number = 0): void {
        const event = { name: name, data: JSON.stringify(data), callId: callId }
        console.info(`Sending ${name} `, event)
        this.socket.sendControlEvent(event)
    }

    public close(): void {
        // NO-OP
    }
}
