import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import ErrorReasons from '../../../../src/Error/error.reasons';

import server from '../../../../src/server';

const url = '/quotes';

chai.use(chaiHttp);

describe('Test getting multiple quotes', () => {
    it('should fail when invalid value is given to the currentPage query parameter', async () => {
        const response = await chai.request(server)
                            .get(`${url}?currentPage=invalid`);
        
        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(ErrorReasons.INVALID_CURRENTPAGE);
    });

    it('should fail when invalid value is given to the resultsPerPage query parameter', async () => {
        const response = await chai.request(server)
                            .get(`${url}?resultsPerPage=invalid`);
        
        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(ErrorReasons.INVALID_RESULTSPERPAGE);
    });

    it('should successfully get a paged result of quotes', async () => {
        const response = await chai.request(server)
                            .get(`${url}?currentPage=0&resultsPerPage=1`);
        
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('quotes')
        expect(response.body.quotes).to.have.length(1);
    });
})