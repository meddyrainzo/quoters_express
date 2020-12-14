import { logger } from '../../../config';
import ErrorReasons from '../../../Error/error.reasons';
import ErrorResponse from '../../../Error/error.response';
import { Result } from '../../../result';
import IQuote from '../models/IQuote';
import Quote from '../models/Quote';
import QuoteErrorReason from '../quote.error.reason';
import ChangeQuoteRequest from '../requests/change.quote.request';
import QuotesQueryParameters from '../requests/quotes.query.parameters';
import WriteQuoteRequest from '../requests/write.quote.request';
import QuotesResponse from '../response/quotes.response';
import SingleQuoteResponse from '../response/single.quote.response';

export default class QuotesService {
    constructor() { }

    private mapQuoteToSingleQuoteResponse(quote: IQuote, userId?: string): SingleQuoteResponse {
        const id = quote._id.toString();
        const likesCount = quote.likes!.length;
        const likedByYou = userId === null ? false : quote.likes!.filter(like => like === userId).length > 0;
        return new SingleQuoteResponse(id, quote.quote, quote.author, quote.posted_by,
             quote.posted_on!.toDateString(), likesCount, likedByYou)
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

    async writeQuote(request: WriteQuoteRequest, userId: string): Promise<Result<SingleQuoteResponse>> {
        try {
            const { quote, author } = request;
            const createdQuote = await Quote.create({
                quote,
                author,
                posted_by: userId
            });
            const singleQuoteResponse = this.mapQuoteToSingleQuoteResponse(createdQuote, userId);
            return { tag: 'success', result: singleQuoteResponse };
        } catch(err) {
            const message = 'Failed to write quote';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, message) };
        }
    }

    async changeQuote(request: ChangeQuoteRequest, quoteId: string, userId: string): Promise<Result<SingleQuoteResponse>> {
        try {
            const { quote, author } = request;
            const quoteToUpdate = await Quote.findById(quoteId);
           
            if(!quoteToUpdate) {
                logger.error(`No quote found with the given id ${quoteId}`);
                return { tag: 'failure', error: new ErrorResponse(404, QuoteErrorReason.NOT_FOUND) };
            }

            if (quoteToUpdate.posted_by !== userId) {
                logger.error("Wrong user trying to update a quote");
                return { tag: 'failure', error: new ErrorResponse(403, ErrorReasons.FORBIDDEN) };
            }

            const updatedQuote = await Quote.findOneAndUpdate({ _id: quoteToUpdate.id }, {
                quote,
                author,
                posted_by: userId
            }, { new: true });
            const singleQuoteResponse = this.mapQuoteToSingleQuoteResponse(updatedQuote!, userId);
            return { tag: 'success', result: singleQuoteResponse };
        } catch(err) {
            const message = 'Failed to write the quote';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, message) };
        }
    }

    async reactToQuote(quoteId: string, userId: string): Promise<Result<string>> {
        try {
            const quote = await Quote.findById(quoteId);
            if(!quote) {
                logger.error(`No quote found with the given id ${quoteId}`);
                return { tag: 'failure', error: new ErrorResponse(404, QuoteErrorReason.NOT_FOUND) };
            }
            let likes: string[];
            // Any likes yet?
            if (quote.likes) {
                // Check if the user has already liked the quote. If yes, then remove the like
                const found = quote.likes.find(l => l === userId);
                if (found) {
                    likes = quote.likes.filter(l => l !== userId);
                } else {
                    quote.likes.push(userId);
                    likes = quote.likes;
                }
            } else {
                likes = [userId];
            }
            const update = { likes: likes };
            await Quote.updateOne({ _id: quote.id }, {
                update
            });
            logger.info('Successfully reacted to the quote');
            return { tag: 'success', result: '' };
        } catch (err) {
            const message = 'Failed to delete the quote';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, message) };
        }
    }

    async deleteQuote(quoteId: string, userId: string): Promise<Result<string>> {
        try {
            const quote = await Quote.findById(quoteId);
            if(!quote) {
                logger.error(`No quote found with the given id ${quoteId}`);
                return { tag: 'failure', error: new ErrorResponse(404, QuoteErrorReason.NOT_FOUND) };
            }

            if (quote.posted_by !== userId) {
                logger.error("Wrong user trying to update a quote");
                return { tag: 'failure', error: new ErrorResponse(403, ErrorReasons.FORBIDDEN) };
            }
            await Quote.deleteOne({ _id: quoteId });
            logger.info('Deleted the quote successfully');
            return { tag: 'success', result: '' };
        } catch (err) {
            const message = 'Failed to delete the quote';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(404, message) };
        }

    }
}