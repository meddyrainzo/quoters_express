import { plainToClass } from "class-transformer"
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express"
import { logger } from "../config";
import ErrorResponse from "../Error/error.response";
import ErrorStatus from "../Error/error.status";

const validationMiddleware = (clazz: any): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const a = req.body;
        const value = plainToClass(clazz, req.body);
        var validationErrors = await validate(value, { whitelist: true, forbidUnknownValues: true, dismissDefaultMessages: true });

        if (validationErrors.length === 0) 
            next();
        else {
            let errorReasons = [];
            let errorConstraints = validationErrors.map(error => error.constraints);
            for (let index in errorConstraints) {
                let constraint = errorConstraints[index];
                for (let key in constraint) {
                    errorReasons.push(constraint[key]);
                }
            }

            let errorReason = errorReasons.join(', ');
                        
            let errorResponse = new ErrorResponse(ErrorStatus.BAD_REQUEST, errorReason);
            logger.error('Validation failed', errorResponse);
            res.status(errorResponse.status).json(errorResponse);
        } 
    }
}

export default validationMiddleware;