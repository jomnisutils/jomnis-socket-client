import { HandlerCallback } from "./types"

export interface ISocketClient {
    on: (evName: string, callback: HandlerCallback) => void
    open: (...args: any[]) => void
    sendMessage: (message: string, data?: any) => void
    close: () => void
}
