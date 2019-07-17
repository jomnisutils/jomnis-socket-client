import { AbstractSocketClient } from "./AbstractSocketClient"
import { HandlerCallback, JOmnis } from "./types"

export class OmnisSocketClient extends AbstractSocketClient {
    private socket: JOmnis
    private callbackObject: { [message: string]: HandlerCallback }

    public constructor(omnisSocket: JOmnis) {
        super()
        this.socket = omnisSocket
        // Prepara il callback object con i metodi standard di omnis
        this.callbackObject = {
            omnisOnLoad: (): void => {
                console.info("omnisOnLoad")
            },
            omnisOnWebSocketOpened: (): void => {
                console.info("omnisOnWebSocketOpened")
                this.fire("socketReady", 0)
            },
            test: (data: any): void => {
                console.log("TEST!")
                console.log(data)
            },
        }
    }

    public on(messageName: string, handler: HandlerCallback): void {
        this.callbacks.set(messageName, handler)
        this.callbackObject[messageName] = (evData: string): void => {
            const parsedData = JSON.parse(evData)
            console.log(`Ricevuto messaggio ${messageName}`, evData, parsedData)

            this.fire(messageName, 0, parsedData)
        }
    }

    public open(): void {
        if (this.socket.callbackHotSwap) {
            this.socket.callbackHotSwap(this.callbackObject)
        } else {
            this.socket.callbackObject = this.callbackObject
        }
    }

    public sendMessage(name: string, data?: any, callId?: number): void {
        console.info(`Invio l'evento ${name} `, data)
        if (!data) {
            data = {}
        }
        if (callId === null || callId === undefined) {
            callId = 0
        }
        this.socket.sendControlEvent({ name: name, data: JSON.stringify(data), callId: callId })
    }

    public close(): void {
        // NO-OP
    }
}
