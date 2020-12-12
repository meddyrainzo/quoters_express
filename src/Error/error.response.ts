export default class ErrorResponse {
    constructor(public readonly status: number, public readonly errorReason: string) { }
}