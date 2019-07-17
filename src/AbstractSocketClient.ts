import { HandlerCallback } from "./types"

export abstract class AbstractSocketClient {
    protected callbacks: Map<string, HandlerCallback>
    public constructor() {
        this.callbacks = new Map()
    }

    public abstract on(evName: string, callback: HandlerCallback): void
    public abstract open(...args: any[]): void
    public abstract sendMessage(message: string, data?: any, callId?: number): void
    public abstract close(): void

    protected buildResponseFunction(callId: number) {
        return (name: string, data?: any) => {
            this.sendMessage(name, data, callId)
        }
    }

    protected fire(evName: string, callId: number, evData?: any): void {
        const callback = this.callbacks.get(evName)
        if (callback) {
            let responseFn = this.buildResponseFunction(callId)
            callback(evData, responseFn)
        }
    }
}
