import { ObjectID } from 'mongodb';

import { logger } from '../../../config';
import ErrorResponse from '../../../Error/error.response';
import { Result } from '../../../result';
import IQuote from '../models/IQuote';
import Quote from '../models/Quote';
import QuoteErrorReason from '../quote.error.reason';
import QuotesQueryParameters from '../requests/quotes.query.parameters';
import QuotesResponse from '../response/quotes.response';
import SingleQuoteResponse from '../response/single.quote.response';

export default class QuotesService {
    constructor() { }

    private mapQuoteToSingleQuoteResponse(quote: IQuote, userId?: string): SingleQuoteResponse {
        const id = quote._id.toString();
        const likesCount = quote.likes.length;
        const likedByYou = userId === null ? false : quote.likes.filter(like => like === userId).length > 0;
        return new SingleQuoteResponse(id, quote.quote, quote.author, quote.posted_by,
             quote.posted_on.toDateString(), likesCount, likedByYou)
    }

    async getQuotes(queryParameters: QuotesQueryParameters, userId?: string): Promise<Result<QuotesResponse>> {
        try {
            const { currentPage, resultsPerPage } = queryParameters;
            const skip = currentPage * resultsPerPage;
            const quotes = await Quote.find().skip(skip).limit(resultsPerPage);
            const quoteResponse = quotes.length === 0 ? [] : quotes.map(quote => this.mapQuoteToSingleQuoteResponse(quote, userId));
            logger.info('Quotes retrieved successfully');
            return { tag: 'success', result: new QuotesResponse(quoteResponse) };
        } catch (err)
        {
            const message = 'Failed to retrieve the quotes';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, message) };
        }
    }

    async getSingleQuote(quoteId: string, userId?: string): Promise<Result<SingleQuoteResponse>> {
        try {
            const quote = await Quote.findById(quoteId);
            if(!quote) {
                logger.error(`No quote found with the given id ${quoteId}`);
                return { tag: 'failure', error: new ErrorResponse(404, QuoteErrorReason.NOT_FOUND) };
            }
            const singleQuoteResponse = this.mapQuoteToSingleQuoteResponse(quote, userId);
            logger.info('Got the single quote successfully');
            return { tag: 'success', result: singleQuoteResponse };
        } catch(err) {
            const message = 'Failed to get the single quote';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(404, QuoteErrorReason.NOT_FOUND) };
        }
    }
}