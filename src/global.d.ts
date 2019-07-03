// declare var jOmnis: JOmnis
declare type JOmnis = {
    sendControlEvent: (data: any) => void
    callbackObject: any
    callbackHotSwap?: (data: any) => void // custom method to allow a late initialization of the callback object
}
