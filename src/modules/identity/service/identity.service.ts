import jwt from 'jsonwebtoken';

import { logger } from '../../../config';
import ErrorResponse from '../../../Error/error.response';
import { Failure, Result } from '../../../result';
import IdentityErrorReason from '../identity.error.reason';
import User from '../models/User';
import LoginUserRequest from '../requests/login.user.request';
import RegisterUserRequest from '../requests/register.user.request';
import LoginUserResponse from '../response/login.user.response';
import RegisterUserResponse from '../response/register.user.response';
import PasswordHasher from '../utils/password.hasher';
import { jwtConfig } from '../../../config';

export default class IdentityService {

    async registerUser(request: RegisterUserRequest) : Promise<Result<RegisterUserResponse>> {
        const { firstname, lastname, email, password } = request;
        try {
            const hashedPassword = await PasswordHasher.hashPassword(password);
            const user = await User.create({
                firstname,
                lastname,
                email,
                password: hashedPassword
            });
            logger.info(`Successfully registered user ${firstname} ${lastname}`);
            return { tag: 'success', result: new RegisterUserResponse(user._id.toString()) };
        } catch(err) {
            logger.error('An error occured when registering the user', { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, 'Failed to register the user') };
        }
    }

    async loginUser(request: LoginUserRequest): Promise<Result<LoginUserResponse>> {
        const { email, password } = request;
        const invalidLoginError = { tag: 'failure', error: new ErrorResponse(404, IdentityErrorReason.INVALID_LOGIN) }  as Failure;
        try {
            const user = await User.findOne({email: email});
            if (!user)
            {
                logger.error(`User does not exist with email ${email}`);
                return invalidLoginError;
            }

            // validate the password
            const isPasswordValid = await PasswordHasher.verifyPassword(password, user.password);
            if (!isPasswordValid) {
                logger.error('The password entered is not valid for the email');
                return invalidLoginError;
            }
            logger.info('User logged in successfully');
            const { _id, firstname, lastname } = user;
            const userId = _id.toString();
            const token = jwt.sign({ sub: userId }, jwtConfig.jwt_secret ?? "Secret", { expiresIn: "1d"});
            return { tag: 'success', result: new LoginUserResponse(userId, firstname, lastname, email, token) }
        } catch (err) {
            logger.error('An error occured during login', { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, 'Failed to log in user') };
        }
    }

}