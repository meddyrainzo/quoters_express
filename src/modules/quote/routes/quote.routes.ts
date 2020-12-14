import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../../config';
import Header from '../../../header';
import authenticationMiddleware from '../../../middlewares/authentication.middleware';
import validationMiddleware from '../../../middlewares/validation.middleware';
import match from '../../../result';
import ChangeQuoteRequest from '../requests/change.quote.request';
import QuoteQueryParameters from '../requests/quotes.query.parameters';
import WriteQuoteRequest from '../requests/write.quote.request';
import QuotesService from '../service/quotes.service';

const quoteRouter = Router();
const quotesService = new QuotesService();

const getUserIdFromTokenIfItExists = (req: Request): string => {
    var token = req.get(Header.AUTH_TOKEN);
    if (!token) {
        return '';
    }
    try {
        var decoded = jwt.verify(token, jwtConfig.jwt_secret!);
        return (<any>decoded).sub;
    } catch(_) {
        return '';
    }
}

// Get quotes
quoteRouter.get('/', validationMiddleware(QuoteQueryParameters, 'query'), async(req: Request, res: Response) => {
    const { currentPage, resultsPerPage } = req.query;
    const currentPageNumber = parseInt(currentPage!.toString());
    const resultsPerPageNumber = parseInt(resultsPerPage!.toString());
    const queryParameters = new QuoteQueryParameters(currentPageNumber, resultsPerPageNumber);
    const userId = getUserIdFromTokenIfItExists(req);
    const quotesResponse = await quotesService.getQuotes(queryParameters, userId);

    return match(quotesResponse, 
        success => res.status(200).json(success),
        failure => res.status(failure.status).json(failure)    
    );
});

// Get quote by id
quoteRouter.get('/:id', async (req: Request, res: Response) => {
    const quoteId = req.params.id;
    const userId = getUserIdFromTokenIfItExists(req);
    const quoteResponse = await quotesService.getSingleQuote(quoteId, userId);

    return match(quoteResponse, 
        success => res.status(200).json(success),
        failure => res.status(failure.status).json(failure)
    );
});

// Write quote
quoteRouter.post('/', authenticationMiddleware(), validationMiddleware(WriteQuoteRequest, 'body'), async (req: Request, res: Response) => {
    const userId = req.body['userId'];
    const request = req.body as WriteQuoteRequest;
    const response = await quotesService.writeQuote(request, userId);

    return match(response, 
        success => res.status(201).json(success),
        failure => res.status(failure.status).json(failure)
    );
});

// Change quote
quoteRouter.put('/:id', authenticationMiddleware(), validationMiddleware(ChangeQuoteRequest, 'body'), async(req: Request, res: Response) => {
    const quoteId = req.params.id;
    const userId = req.body['userId'];
    const request = req.body as ChangeQuoteRequest;
    const response = await quotesService.changeQuote(request, quoteId, userId);

    return match(response, 
        success => res.status(200).json(success),
        failure => res.status(failure.status).json(failure)
    );
})

// Like/Dislike a quote
quoteRouter.put('/:id/react', authenticationMiddleware(), async(req: Request, res: Response) => {
    const quoteId = req.params.id;
    const userId = req.body['userId'];

    const response = await quotesService.reactToQuote(quoteId, userId);

    return match(response,
        _ => res.status(204).json({}),
        failure => res.status(failure.status).json(failure)
    );
});

// Delete quote
quoteRouter.delete('/:id', authenticationMiddleware(), async(req:Request, res: Response) => {
    const quoteId = req.params.id;
    const userId = req.body['userId'];
    const response = await quotesService.deleteQuote(quoteId, userId);

    return match(response, 
        _ => res.status(204).json({}),
        failure => res.status(failure.status).json(failure)
    );
})

export default quoteRouter;