import { IsString, MaxLength, MinLength, ValidationArguments } from "class-validator";
import ErrorReasons from "../../../Error/error.reasons";
import QuoteErrorReason from "../quote.error.reason";

export default class WriteQuoteRequest {

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `The quote ${ErrorReasons.REQUIRED}`;
        }
        return `The quote ${ErrorReasons.INVALID_STRING}`;
    } })
    @MinLength(1, { message: QuoteErrorReason.QUOTE_TOO_SMALL})
    @MaxLength(250, { message: QuoteErrorReason.QUOTE_TOO_LONG})
    quote: string;

    @IsString({ message: (args: ValidationArguments) => {
        if (!args.value) {
            return `The author ${ErrorReasons.REQUIRED}`;
        }
        return `The author ${ErrorReasons.INVALID_STRING}`;
    } })
    @MinLength(1, { message: QuoteErrorReason.AUTHOR_TOO_SHORT})
    @MaxLength(50, { message: QuoteErrorReason.AUTHOR_TOO_LONG})
    author: string;

    constructor(quote: string, author: string) {
        this.quote = quote;
        this.author = author;
     }
}