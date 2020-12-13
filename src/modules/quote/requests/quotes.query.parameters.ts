import { IsNumberString } from "class-validator";
import ErrorReasons from "../../../Error/error.reasons";

export default class QuoteQueryParameters {
    @IsNumberString({ }, { message: ErrorReasons.INVALID_CURRENTPAGE })
    currentPage: number;

    @IsNumberString({}, { message: ErrorReasons.INVALID_RESULTSPERPAGE })
    resultsPerPage: number;

    constructor(currentPage: number = 0, resultsPerPage: number = 10) {
        this.currentPage = currentPage;
        this.resultsPerPage = resultsPerPage;
    }
}