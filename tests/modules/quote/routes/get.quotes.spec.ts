import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../../../src/server';

const url = '/quotes';

describe('Test getting multiple quotes', () => {
    it('should fail if the request queries are invalid', async () => {
        const request = { from : 'here', to: 'there' };

        const response = chai.request(server)
    });
})