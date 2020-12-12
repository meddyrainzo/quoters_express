import { expect } from 'chai';

import ErrorResponse from '../src/Error/error.response';
import match, { Failure, Result } from '../src/result';

describe('Testing the result type', () => {
    it('should execute the success callback when the result is a success', () => {
        let result = { tag: 'success', result: "20" } as Result<string>;
        let finalResult = match(result,
            success => parseInt(success, 10) + 10,
            _ => 1
        );
        expect(finalResult).to.eq(30);
    });

    it('should execute the error callback when the result is an error', () => {
        let errorResponse = new ErrorResponse(400, "This is an error");
        let result = { tag: 'failure', error: errorResponse } as Failure;
        let finalResult = match(result, 
            _ => "",
            error => error.errorReason
        );
        expect(finalResult).to.eq(errorResponse.errorReason);
    })
})
