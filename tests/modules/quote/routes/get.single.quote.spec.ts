import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../../src/server';
import QuoteErrorReason from '../../../../src/modules/quote/quote.error.reason';

chai.use(chaiHttp);
const url = '/quotes';
const quoteId = '5dae58764330512bdc80776a';

describe('Test getting a single quote by its id', () => {
    it('should return a 404 if the quote is not found', async () => {
        const response = await chai.request(server).get(`${url}/invalidId`);

        expect(response.status).to.be.equal(404);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(QuoteErrorReason.NOT_FOUND);
    });

    it('should return a quote if the quote is found', async () => {
        const response = await chai.request(server).get(`${url}/${quoteId}`);

        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('id', quoteId);
        expect(response.body).to.have.property('quote', 'Everything that has a beginning has an end');
        expect(response.body).to.have.property('likesCount', 1);
        expect(response.body).to.have.property('likedByYou', false);
    });
});
