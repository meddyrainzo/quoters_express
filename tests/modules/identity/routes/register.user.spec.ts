import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../../../../src/server';
import RegisterUserRequest from '../../../../src/modules/identity/requests/register.user.request';
import IdentityErrorReason from '../../../../src/modules/identity/identity.error.reason';

chai.use(chaiHttp);

const url = '/identity/register';
const registerUserRequest = new RegisterUserRequest('firstname', 'lastname', 'first@last.com', 'password');

describe('Testing user registration', () => {

    it('should fail when invalid data is sent in the request', async () => {
        const request = { firstname: "", lastname: "vsfvcpiscnevpnspvnknvdnfpi", password: { "hey": "ho" } };

        const response = await chai.request(server).post(url).send(request);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(IdentityErrorReason.SHORT_FIRSTNAME);
        expect(response.body.errorReason).to.contain(IdentityErrorReason.LONG_LASTNAME);
        expect(response.body.errorReason).to.contain(`Email ${IdentityErrorReason.REQUIRED}`);
        expect(response.body.errorReason).to.contain(`Password ${IdentityErrorReason.INVALID_STRING}`);
    })

    it('should register a user with a correct request successfully', async () => {
        const response = await chai.request(server).post(url).send(registerUserRequest);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
    })
})
