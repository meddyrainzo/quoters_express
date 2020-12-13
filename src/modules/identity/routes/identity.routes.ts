import { Request, Response, Router } from 'express';
import Header from '../../../header';
import authenticationMiddleware from '../../../middlewares/authentication.middleware';
import validationMiddleware from '../../../middlewares/validation.middleware';
import match from '../../../result';
import ChangePasswordRequest from '../requests/change.password.request';
import LoginUserRequest from '../requests/login.user.request';
import RegisterUserRequest from '../requests/register.user.request';
import IdentityService from '../service/identity.service';

const identityRouter = Router();
const identityService = new IdentityService();

// Register user
identityRouter.post('/register', validationMiddleware(RegisterUserRequest, 'body'), async (req: Request, res: Response) => {
    let request = req.body as RegisterUserRequest;
    let result = await identityService.registerUser(request);
    return match(result, 
        response => res.status(201).json(response),
        error => res.status(error.status).json(error) 
    );
});

// Login user
identityRouter.post('/login', validationMiddleware(LoginUserRequest, 'body'), async(req: Request, res: Response) => {
    let request = req.body as LoginUserRequest;
    let response = await identityService.loginUser(request);
    return match(response, 
        success => {
            const { token, ...exceptToken } = success;
            res.set(Header.AUTH_TOKEN, success.token);
            res.status(200).json({ ...exceptToken });
        },
        error => res.status(error.status).json(error)
    );
});

// change user password
identityRouter.post('/changepassword', authenticationMiddleware(), validationMiddleware(ChangePasswordRequest, 'body'), async(req: Request, res: Response) => {
    let request = req.body as ChangePasswordRequest;
    let response = await identityService.changePassword(request);
    return match(response, 
        _ => res.status(204).json({}),
        error => res.status(error.status).json(error)    
    );
})

export default identityRouter;