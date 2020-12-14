import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import ErrorReasons from '../../../../src/Error/error.reasons';
import Header from '../../../../src/header';
import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';

import server from '../../../../src/server';

chai.use(chaiHttp);
const userId = '5dae58764330512bdc80776a';
const quoteId = '5dae58764680512bdc80397f';
const url = `/quotes/${quoteId}/react`;

let token: string;

before(done => {
    server.on('listening', () => {
        const request = new LoginUserRequest('randy@savage.com', 'RandySavage')
        chai.request(server).post('/identity/login').send(request).end((_, res) =>{
            token = res.get(Header.AUTH_TOKEN);
            done();
        });
    })     
});


describe('Testing liking and unliking quotes', () => {
    
    // Not authenticated should fail
    it('should fail if the user is not authenticated', done => {
        chai.request(server)
            .put(url)
            .end((_, response) => {
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(ErrorReasons.UNAUTHORIZED);
                done();
            });
    });

    // Like a quote successfully
    it('should successfully react to a quote', done => {
        chai.request(server)
            .put(url)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(204);
                done();
            });
    });
});