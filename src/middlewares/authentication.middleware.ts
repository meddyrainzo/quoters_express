import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';
import { jwtConfig, logger } from "../config";
import ErrorReasons from "../Error/error.reasons";
import ErrorResponse from "../Error/error.response";

import Header from "../header";

const authenticationMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        var token = req.get(Header.AUTH_TOKEN);
        if (!token) {
            const error = new ErrorResponse(401, ErrorReasons.UNAUTHORIZED)
            res.status(401).json(error);
        } else {
            try {
                var decodedValue = jwt.verify(token!, jwtConfig.jwt_secret!);
                req.body['userId'] = (<any>decodedValue).sub;
                next();
            } catch (err) {
                logger.error('The token must have expired');
                res.status(401).json({ error_message: ErrorReasons.UNAUTHORIZED });
            }
        }
        
    };
}

export default authenticationMiddleware;