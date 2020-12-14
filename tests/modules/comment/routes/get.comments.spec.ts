import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import ErrorReasons from '../../../../src/Error/error.reasons';
import QuoteErrorReason from '../../../../src/modules/quote/quote.error.reason';

import server from '../../../../src/server';

const url = '/comments';

chai.use(chaiHttp);

describe('Test getting multiple comments', () => {
    it('should fail when quote does not exist', async () => {
        const response = await chai.request(server)
                            .get(`${url}/invalidQuoteId`);
        
        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('errorReason');
    });

    it('should successfully get the comments', async () => {
        const response = await chai.request(server)
                            .get(`${url}/5dae58764680512bdc80397f`);
        
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('comments')
        expect(response.body.comments).to.have.length(0);
    });
})