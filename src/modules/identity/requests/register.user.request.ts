import { IsEmail, IsString, MaxLength, MinLength, ValidationArguments } from "class-validator";
import IdentityErrorReason from "../identity.error.reason";

export default class RegisterUserRequest {
    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `First name ${IdentityErrorReason.REQUIRED}`;
        }
        return `First name ${IdentityErrorReason.INVALID_STRING}`;
    }})
    @MinLength(1, { message: IdentityErrorReason.SHORT_FIRSTNAME })
    @MaxLength(25, { message: IdentityErrorReason.LONG_FIRSTNAME })
    firstname: string;

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Last name ${IdentityErrorReason.REQUIRED}`;
        }
        return `Last name ${IdentityErrorReason.INVALID_STRING}`;
    }})
    @MinLength(1, { message: IdentityErrorReason.SHORT_LASTNAME })
    @MaxLength(25, { message: IdentityErrorReason.LONG_LASTNAME })
    lastname: string;

    @IsEmail({}, { message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Email ${IdentityErrorReason.REQUIRED}`;
        }
        return IdentityErrorReason.INVALID_EMAIL;
    } })
    email: string;

    
    @MinLength(1, { message: IdentityErrorReason.SHORT_PASSWORD })
    @MaxLength(125, { message: IdentityErrorReason.LONG_PASSWORD })
    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Password ${IdentityErrorReason.REQUIRED}`;
        }
        return `Password ${IdentityErrorReason.INVALID_STRING}`;
    } })
    password: string;

    constructor(firstname: string, lastname: string, email: string, password: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}