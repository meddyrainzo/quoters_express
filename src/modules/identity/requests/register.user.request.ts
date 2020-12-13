import { IsEmail, IsString, MaxLength, MinLength, ValidationArguments } from "class-validator";
import ErrorReasons from "../../../Error/error.reasons";
import IdentityErrorReason from "../identity.error.reason";

export default class RegisterUserRequest {
    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `First name ${ErrorReasons.REQUIRED}`;
        }
        return `First name ${ErrorReasons.INVALID_STRING}`;
    }})
    @MinLength(1, { message: IdentityErrorReason.SHORT_FIRSTNAME })
    @MaxLength(25, { message: IdentityErrorReason.LONG_FIRSTNAME })
    firstname: string;

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Last name ${ErrorReasons.REQUIRED}`;
        }
        return `Last name ${ErrorReasons.INVALID_STRING}`;
    }})
    @MinLength(1, { message: IdentityErrorReason.SHORT_LASTNAME })
    @MaxLength(25, { message: IdentityErrorReason.LONG_LASTNAME })
    lastname: string;

    @IsEmail({}, { message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Email ${ErrorReasons.REQUIRED}`;
        }
        return IdentityErrorReason.INVALID_EMAIL;
    } })
    email: string;

    
    @MinLength(1, { message: IdentityErrorReason.SHORT_PASSWORD })
    @MaxLength(125, { message: IdentityErrorReason.LONG_PASSWORD })
    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Password ${ErrorReasons.REQUIRED}`;
        }
        return `Password ${ErrorReasons.INVALID_STRING}`;
    } })
    password: string;

    constructor(firstname: string, lastname: string, email: string, password: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}