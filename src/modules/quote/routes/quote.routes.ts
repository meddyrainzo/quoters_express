import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../../config';
import Header from '../../../header';
import validationMiddleware from '../../../middlewares/validation.middleware';
import match from '../../../result';
import QuoteQueryParameters from '../requests/quotes.query.parameters';
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

// Change quote

// Delete quote

export default quoteRouter;