import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import ErrorReasons from '../../../../src/Error/error.reasons';
import Header from '../../../../src/header';
import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';
import server from '../../../../src/server';

chai.use(chaiHttp);
const url = '/quotes/7eae59764680125efc80310f';

let token: string;
let rightToken: string;

before(done => {
    server.on('listening', () => {
        const request = new LoginUserRequest('randy@savage.com', 'RandySavage')
        chai.request(server).post('/identity/login').send(request).then(res =>{
            token = res.get(Header.AUTH_TOKEN);
            chai.request(server).post('/identity/login').send({ email : 'richie@meddy.com', password: 'RichmanMeddy' })
                .end((_, response) => {
                    rightToken = response.get(Header.AUTH_TOKEN);
                    done();
                })
        });
    })     
});

describe('Test deleting quotes', () => {

    it('should fail if the user is not authenticated', done => {
        chai.request(server).delete(url).end((_, response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('errorReason');
            expect(response.body.errorReason).to.contain(ErrorReasons.UNAUTHORIZED);
            done();
        });        
    });

    it('should fail if the authenticated user did not create the quote', done => {
        chai.request(server)
            .delete(url)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(403);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(ErrorReasons.FORBIDDEN);
                done();
            });
    });

    it('should succeed if the user that wrote the quote deletes it', done => {
        chai.request(server).delete(url)
            .set(Header.AUTH_TOKEN, rightToken)
            .end((_, response) => {
                expect(response.status).to.equal(204)
                done();
            });
    });
});
