import { logger } from "../../../config";
import ErrorResponse from "../../../Error/error.response";
import { Result } from "../../../result";
import User from "../models/User";
import RegisterUserRequest from "../requests/register.user.request";
import { RegisterUserResponse } from "../response/register.user.response";
import PasswordHasher from "../utils/password.hasher";

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
            return { tag: "success", result: new RegisterUserResponse(user._id.toString(), firstname, lastname, email) };
        } catch(err) {
            logger.error('An error occured when registering the user', { error_message: err.message });
            return { tag: "failure", error: new ErrorResponse(400, "Failed to register the user") };
        }
    }
}