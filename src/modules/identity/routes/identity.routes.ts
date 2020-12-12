import { Request, Response, Router } from 'express';
import validationMiddleware from '../../../middlewares/validation.middleware';
import match from '../../../result';
import LoginUserRequest from '../requests/login.user.request';
import RegisterUserRequest from '../requests/register.user.request';
import IdentityService from '../service/identity.service';

const identityRouter = Router();
const identityService = new IdentityService();

// Register user
identityRouter.post('/register', validationMiddleware(RegisterUserRequest), async (req: Request, res: Response) => {
    let request = req.body as RegisterUserRequest;
    let result = await identityService.registerUser(request);
    return match(result, 
        response => res.status(201).json(response),
        error => res.status(error.status).json(error) 
    );
});

// Login user
identityRouter.post('/login', validationMiddleware(LoginUserRequest), async(req: Request, res: Response) => {
    let request = req.body as LoginUserRequest;
    let response = await identityService.loginUser(request);
    return match(response, 
        success => res.status(200).json(success),
        error => res.status(error.status).json(error)
    );
})

// change user password

export default identityRouter;