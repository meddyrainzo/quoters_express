import ErrorResponse from "./Error/error.response";

export type Success<TSuccess> = { tag: "success", result: TSuccess }
export type Failure = { tag: "failure", error: ErrorResponse }
export type Result<TSuccess> = Success<TSuccess> | Failure

function match<TSuccess, TResult>(result: Result<TSuccess>, success: (value: TSuccess) => TResult,
                                 failure: (error: ErrorResponse) => TResult) {  
    if (result.tag === "success")
        return success(result.result);
    return failure(result.error);
}

export default match;