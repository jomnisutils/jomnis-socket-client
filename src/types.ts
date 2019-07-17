declare type SendResultEventFunction = (name: string, data?: any) => void

export declare type HandlerCallback = (req: any, res: SendResultEventFunction) => void

export declare type JOmnis = {
    sendControlEvent: (data: any) => void
    callbackObject: any
    callbackHotSwap?: (data: any) => void // custom method to allow a late initialization of the callback object
}
