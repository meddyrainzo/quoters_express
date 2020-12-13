import SingleQuoteResponse from "./single.quote.response";

export default class QuotesResponse {
    quotes: SingleQuoteResponse[];

    constructor(quotes: SingleQuoteResponse[]) {
        this.quotes = quotes;
    }
}