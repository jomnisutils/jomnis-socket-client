import { ISocketClient } from "./ISocketClient"
import { HandlerCallback, JOmnis } from "./types"

export class OmnisSocketClient implements ISocketClient {
    private socket: JOmnis
    private callbacks: Map<string, HandlerCallback>
    private callbackObject: { [message: string]: HandlerCallback }

    public constructor(omnisSocket: JOmnis) {
        this.callbacks = new Map()
        this.socket = omnisSocket
        // Prepara il callback object con i metodi standard di omnis
        this.callbackObject = {
            omnisOnLoad: (): void => {
                console.info("omnisOnLoad")
            },
            omnisOnWebSocketOpened: (): void => {
                console.info("omnisOnWebSocketOpened")
                this.fire("socketReady")
            },
            test: (data: any): void => {
                console.log("TEST!")
                console.log(data)
            },
        }
    }

    private fire(evName: string, evData?: any): void {
        const callback = this.callbacks.get(evName)
        if (callback) {
            callback(evData)
        }
    }

    public on(messageName: string, handler: HandlerCallback): void {
        this.callbacks.set(messageName, handler)
        this.callbackObject[messageName] = (evData: string): void => {
            const parsedData = JSON.parse(evData)
            console.log(`Ricevuto messaggio ${messageName}`, evData, parsedData)

            this.fire(messageName, parsedData)
        }
    }

    public open(): void {
        if (this.socket.callbackHotSwap) {
            this.socket.callbackHotSwap(this.callbackObject)
        } else {
            this.socket.callbackObject = this.callbackObject
        }
    }

    public sendMessage(name: string, data?: any): void {
        console.info(`Invio l'evento ${name} `, data)
        if (!data) {
            data = {}
        }
        this.socket.sendControlEvent({ name: name, data: JSON.stringify(data) })
    }

    public close(): void {
        // NO-OP
    }
}
