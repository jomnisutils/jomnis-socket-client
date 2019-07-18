export class SocketMessage {
    public name: string
    public data: any
    public callId: number

    public constructor(name: string, data?: any, callId?: number) {
        this.name = name
        this.callId = callId === undefined ? 0 : callId
        this.data = data
    }
}
