import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import ErrorReasons from '../../../../src/Error/error.reasons';
import Header from '../../../../src/header';
import server from '../../../../src/server';
import ChangeQuoteRequest from '../../../../src/modules/quote/requests/change.quote.request';
import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';

chai.use(chaiHttp);

const url = '/quotes/5dae58764330512bdc80776a';
const quote = 'I remember I was conflicted. Misusing my influence'
const author = 'Kendrick Lamar';
const goodRequest = new ChangeQuoteRequest(quote, author);

let token: string;
let rightToken: string;

before(done => {
    server.on('listening', () => {
        const request = new LoginUserRequest('randy@savage.com', 'RandySavage')
        chai.request(server).post('/identity/login').send(request).then(res =>{
            token = res.get(Header.AUTH_TOKEN);
            chai.request(server).post('/identity/login').send({ email :  'richie@meddy.com', password: 'RichmanMeddy' })
                .end((_, res) => {
                    rightToken = res.get(Header.AUTH_TOKEN);
                    done();
                })
        });
    })     
});

describe('Test changing quotes', () => {

    it('should fail if the user is not authenticated', done => {
        chai.request(server)
            .put(url)
            .send(goodRequest)
            .end((_, response) => {
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(ErrorReasons.UNAUTHORIZED);
                done();
            });
    });

    it('should fail if the request is invalid', done => {
        const request = { quote: 'Bad quote' };

        chai.request(server)
            .put(url)
            .send(request)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(`The author ${ErrorReasons.REQUIRED}`);
                done();
            });
    });

    it('should fail if the authenticated user didn\'t create the quote', done => {
        chai.request(server)
            .put(url)
            .send(goodRequest)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(403);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(ErrorReasons.FORBIDDEN);
                done();
            });
    });

    it('should pass if the authenticated user updates his quote', done => {
        chai.request(server).put(url)
        .send(goodRequest)
        .set(Header.AUTH_TOKEN, rightToken)
        .end((_, response) => {
           expect(response.status).to.equal(200)
           expect(response.body).to.have.property('quote', quote);
           expect(response.body).to.have.property('author', author);
           done();
        });
    });

});
