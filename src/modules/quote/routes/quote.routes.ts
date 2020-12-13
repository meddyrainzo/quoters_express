import { Router, Request, Response } from 'express';

const quoteRouter = Router();

// Get quotes
quoteRouter.get('/', async(req: Request, res: Response) => {

});

// Get quote by id
quoteRouter.get('/:id', async(req: Request, res: Response) => {

});

// Write quote

// Change quote

// Delete quote

export default quoteRouter;