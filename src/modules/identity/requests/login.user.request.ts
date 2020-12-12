import { IsEmail, IsString, ValidationArguments } from "class-validator";
import IdentityErrorReason from "../identity.error.reason";

export default class LoginUserRequest {
    @IsEmail({}, { message: (args: ValidationArguments) => {
            if (!args.value) {
                return `Email ${IdentityErrorReason.REQUIRED}`;
            }
            return IdentityErrorReason.INVALID_EMAIL;
        } 
    })
    email: string;

    @IsString({ message: (args: ValidationArguments) => {
            if (!args.value) {
                return `Password ${IdentityErrorReason.REQUIRED}`;
            }
            return `Password ${IdentityErrorReason.INVALID_STRING}`;
        }
    })
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}