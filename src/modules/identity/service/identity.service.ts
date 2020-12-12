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
import ChangePasswordRequest from '../requests/change.password.request';

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

    async changePassword(request: ChangePasswordRequest): Promise<Result<string>> {
        const { userId, oldPassword, newPassword} = request;
        try {
            const user = await User.findById(userId);
            if (!user){
                logger.error('No user found with the userId in the token');
                return { tag: 'failure', error: new ErrorResponse(400, 'Error changing password') };
            }
            // Validate the password
            const isPasswordValid = await PasswordHasher.verifyPassword(oldPassword, user.password);
            if (!isPasswordValid) {
                logger.error(IdentityErrorReason.INCORRECT_OLDPASSWORD);
                return { tag: 'failure', error: new ErrorResponse(400, IdentityErrorReason.INCORRECT_OLDPASSWORD) };
            }
            const hashedNewPassword = await PasswordHasher.hashPassword(newPassword);
            await user.updateOne({ password: hashedNewPassword });
            logger.info('Successfully changed password');
            return { tag: 'success', result: '' };
        } catch(err) {
            logger.error('An error occured during password change', { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, 'Failed to change the password') };
        }
    }
}