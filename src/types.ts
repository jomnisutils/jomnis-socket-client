import { SocketRequest } from "./SocketRequest"

export declare type HandlerCallback = (message: SocketRequest) => Promise<{} | void | undefined>

export declare type JOmnis = {
    sendControlEvent: (data: any) => void
    callbackObject: any
    callbackHotSwap?: (data: any) => void // custom method to allow a late initialization of the callback object
}
