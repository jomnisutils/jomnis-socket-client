import { ISocketClient } from './ISocketClient'
import { HandlerCallback, JOmnis } from './types'

export class OmnisSocketClient implements ISocketClient {
    socket: JOmnis
    callbacks: Map<string, HandlerCallback>
    callbackObject: { [message: string]: HandlerCallback }

    constructor(omnisSocket: JOmnis) {
        this.callbacks = new Map()
        this.socket = omnisSocket
        // Prepara il callback object con i metodi standard di omnis
        this.callbackObject = {
            omnisOnLoad: () => {
                console.info('omnisOnLoad')
            },
            omnisOnWebSocketOpened: () => {
                console.info('omnisOnWebSocketOpened')
                this.fire('socketReady')
            },
            test: data => {
                console.log('TEST!')
                console.log(data)
            }
        }
    }

    private fire(evName: string, evData?: any) {
        const callback = this.callbacks.get(evName)
        if (callback) {
            callback(evData)
        }
    }

    on(messageName: string, handler: HandlerCallback) {
        this.callbacks.set(messageName, handler)
        this.callbackObject[messageName] = (evData: string) => {
            const parsedData = JSON.parse(evData)
            console.log(`Ricevuto messaggio ${messageName}`, evData, parsedData)

            this.fire(messageName, parsedData)
        }
    }

    open() {
        if (this.socket.callbackHotSwap) {
            this.socket.callbackHotSwap(this.callbackObject)
        } else {
            this.socket.callbackObject = this.callbackObject
        }
    }

    sendMessage(name: string, data?: any) {
        console.info(`Invio l'evento ${name} `, data)
        if (!data) {
            data = {}
        }
        this.socket.sendControlEvent({ name: name, data: JSON.stringify(data) })
    }

    close() {
        // NO-OP
    }
}
