import { Router, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../../config';
import Header from '../../../header';
import authenticationMiddleware from '../../../middlewares/authentication.middleware';
import validationMiddleware from '../../../middlewares/validation.middleware';
import match from '../../../result';
import WriteCommentRequest from '../request/write.comment.request';

import CommentService from '../services/comment.service';

const commentRouter = Router();
const commentService = new CommentService();

const getUserIdFromTokenIfItExists = (req: Request): string => {
    var token = req.get(Header.AUTH_TOKEN);
    if (!token) {
        return '';
    }
    try {
        var decoded = jwt.verify(token, jwtConfig.jwt_secret!);
        return (<any>decoded).sub;
    } catch(_) {
        return '';
    }
}

// Get comments
commentRouter.get('/:quoteId', async (req: Request, res: Response) => {
    const quoteId = req.params.quoteId;
    const userId = getUserIdFromTokenIfItExists(req);

    const response = await commentService.getComments(quoteId, userId);

    return match(response, 
        success => res.status(200).json(success),
        failure => res.status(failure.status).json(failure)
    );

})

// Create comment
commentRouter.post('/', authenticationMiddleware(), validationMiddleware(WriteCommentRequest, 'body'), async (req: Request, res: Response) => {
    const request = req.body as WriteCommentRequest;
    const userId = req.body['userId'];

    const response = await commentService.writeComment(request, userId);

    return match(response, 
        success => res.status(201).json(success),
        failure => res.status(failure.status).json(failure.errorReason)
    );

})

export default commentRouter;

