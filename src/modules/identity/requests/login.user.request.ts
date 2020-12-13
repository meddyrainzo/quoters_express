import { IsEmail, IsString, ValidationArguments } from "class-validator";
import ErrorReasons from "../../../Error/error.reasons";
import IdentityErrorReason from "../identity.error.reason";

export default class LoginUserRequest {
    @IsEmail({}, { message: (args: ValidationArguments) => {
            if (!args.value) {
                return `Email ${ErrorReasons.REQUIRED}`;
            }
            return IdentityErrorReason.INVALID_EMAIL;
        } 
    })
    email: string;

    @IsString({ message: (args: ValidationArguments) => {
            if (!args.value) {
                return `Password ${ErrorReasons.REQUIRED}`;
            }
            return `Password ${ErrorReasons.INVALID_STRING}`;
        }
    })
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}