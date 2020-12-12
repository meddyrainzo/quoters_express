import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import IdentityErrorReason from "../identity.error.reason";

export default class RegisterUserRequest {
    @IsString({ message: `First name ${IdentityErrorReason.INVALID_STRING}`})
    @MinLength(1, { message: IdentityErrorReason.SHORT_FIRSTNAME })
    @MaxLength(25, { message: IdentityErrorReason.LONG_FIRSTNAME })
    firstname: string;

    @IsString({ message: `Last name ${IdentityErrorReason.INVALID_STRING}`})
    @MinLength(1, { message: IdentityErrorReason.SHORT_LASTNAME })
    @MaxLength(25, { message: IdentityErrorReason.LONG_LASTNAME })
    lastname: string;

    @IsEmail({}, { message: IdentityErrorReason.INVALID_EMAIL })
    email: string;

    @IsString({ message: `Password ${IdentityErrorReason.INVALID_STRING}`})
    @MinLength(1, { message: IdentityErrorReason.SHORT_PASSWORD })
    @MaxLength(125, { message: IdentityErrorReason.LONG_PASSWORD })
    password: string;

    constructor(firstname: string, lastname: string, email: string, password: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}