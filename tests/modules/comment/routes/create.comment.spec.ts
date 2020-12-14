import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import ErrorReasons from '../../../../src/Error/error.reasons';
import Header from '../../../../src/header';
import server from '../../../../src/server';
import WriteCommentRequest from '../../../../src/modules/comments/request/write.comment.request';
import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';

chai.use(chaiHttp);

const url = '/comments/';
const comment = 'This is a really good line'
const goodRequest = new WriteCommentRequest(comment, '7eae59764680125efc80310f');

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

describe('Test writing comments', () => {    
    it('should fail if the user is not authenticated', done => {
        chai.request(server)
            .post(url)
            .send(goodRequest)
            .end((_, response) => {
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(ErrorReasons.UNAUTHORIZED);
                done();
            });
    });

    it('should fail if the request is invalid', done => {
        const request = { hello: 'world' };

        chai.request(server)
            .post(url)
            .send(request)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(`The comment ${ErrorReasons.REQUIRED}`);
                done();
            });
    });

    it('should write a comment successfully if the request is valid and user authenticated', done => {
        chai.request(server)
            .post(url)
            .send(goodRequest)
            .set(Header.AUTH_TOKEN, token)
            .then(response => {
                expect(response.status).to.equal(201);
                expect(response.body).to.have.property('comment', comment);
                chai.request(server).get('/quotes/7eae59764680125efc80310f').end((_, res) => {
                    expect(res.body).to.have.property('comments', 1);
                    done();
                });
            })
    });

});
