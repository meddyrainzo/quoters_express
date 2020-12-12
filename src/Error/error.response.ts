import ErrorStatus from "./error.status";
export default class ErrorResponse {
    constructor(public readonly status: ErrorStatus, public readonly errorReason: string) { }
}