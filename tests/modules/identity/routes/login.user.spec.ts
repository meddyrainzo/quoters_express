import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';
import IdentityErrorReason from '../../../../src/modules/identity/identity.error.reason';
import server from '../../../../src/server';

chai.use(chaiHttp);
const url = '/identity/login';

describe('Test logging in a registered user', () => {
    it('should fail if the user is not registered', async() => {
        const user = new LoginUserRequest("unregistered@email.com", "Password");

        const response = await chai.request(server).post(url).send(user);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(IdentityErrorReason.INVALID_LOGIN);
    })

    it('should fail if a wrong password is given', async() => {
        const user = new LoginUserRequest("randy@savage.com", "Password");

        const response = await chai.request(server).post(url).send(user);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(IdentityErrorReason.INVALID_LOGIN);
    })

    it('should fail if the login request is invalid', async() => {
        const user = { email: "randysavage", pass: "Password"};

        const response = await chai.request(server).post(url).send(user);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(IdentityErrorReason.INVALID_EMAIL);
        expect(response.body.errorReason).to.contain(`Password ${IdentityErrorReason.RE}`);
    })

    it('should log in a registered user successfully', async() => {
        const user = new LoginUserRequest("randy@savage.com", "RandySavage");

        const response = await chai.request(server).post(url).send(user);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('firstname', "Randy");
        expect(response.body).to.have.property('lastname', "Savage");
        expect(response.body).to.have.property('email', user.email);
        expect(response.body).to.have.property('id');
    })
})