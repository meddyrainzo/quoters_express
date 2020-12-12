import { IsString, MaxLength, Min, MinLength, ValidationArguments } from "class-validator";
import IdentityErrorReason from "../identity.error.reason";

export default class ChangePasswordRequest {
    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `Old password ${IdentityErrorReason.REQUIRED}`;
        }
        return `Old password ${IdentityErrorReason.INVALID_STRING}`;
    } })
    oldPassword: string;

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `New password ${IdentityErrorReason.REQUIRED}`;
        }
        return `New password ${IdentityErrorReason.INVALID_STRING}`;
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