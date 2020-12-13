import { IsString, MaxLength, Min, MinLength, ValidationArguments } from "class-validator";
import ErrorReasons from "../../../Error/error.reasons";
import IdentityErrorReason from "../identity.error.reason";

export default class ChangePasswordRequest {
    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Old password ${ErrorReasons.REQUIRED}`;
        }
        return `Old password ${ErrorReasons.INVALID_STRING}`;
    } })
    oldPassword: string;

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `New password ${ErrorReasons.REQUIRED}`;
        }
        return `New password ${ErrorReasons.INVALID_STRING}`;
    } })
    @MinLength(1, { message: IdentityErrorReason.SHORT_PASSWORD })
    @MaxLength(125, { message: IdentityErrorReason.LONG_PASSWORD })
    newPassword: string;

    userId?: string;

    constructor(oldPassword: string, newPassword: string) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

}