import { IsString, ValidationArguments } from "class-validator";
import ErrorReasons from "../../../Error/error.reasons";

export default class WriteCommentRequest {

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `The comment ${ErrorReasons.REQUIRED}`;
        }
        return `The comment ${ErrorReasons.INVALID_STRING}`;
    } })
    comment: string;

    @IsString({ message: `The quote id ${ErrorReasons.INVALID_STRING}` })
    quoteId: string;

    constructor(comment: string, quoteId: string) {
        this.comment = comment;
        this.quoteId = quoteId;
    }
}