import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../../src/server';
import ErrorReasons from '../../../../src/Error/error.reasons';
import Header from '../../../../src/header';
import ChangePasswordRequest from '../../../../src/modules/identity/requests/change.password.request';
import IdentityErrorReason from '../../../../src/modules/identity/identity.error.reason';
import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';

chai.use(chaiHttp);

const url = "/identity/changepassword";

let token: string;

before(done => {
    server.on('listening', () => {
        const request = new LoginUserRequest('fat@dog.com', 'RandySavage')
        chai.request(server)
            .post('/identity/login')
            .send(request)
            .end((_, res) =>{
                token = res.get(Header.AUTH_TOKEN);
                done();
        });
    })     
});

describe('Test changing password', () => {
    it('should fail if the user is not authenticated', async () => {
        const request = new ChangePasswordRequest("oldPassword", "newPassword");

        const response = await chai.request(server)
            .post(url)
            .send(request);
        
        
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('errorReason');
        expect(response.body.errorReason).to.contain(ErrorReasons.UNAUTHORIZED);
    });

    it('should fail if request is invalid', done => {
        const request = { old: "oldpassword", new: "NewPass" };

        chai.request(server)
            .post(url)
            .send(request)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(`Old password ${ErrorReasons.REQUIRED}`);
                expect(response.body.errorReason).to.contain(`New password ${ErrorReasons.REQUIRED}`);
                done();
            });        
    });

    it('should fail if old password is incorrect', done => {
        const request = new ChangePasswordRequest("WrongPassword", "NewPassword");

        chai.request(server)
            .post(url)
            .send(request)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('errorReason');
                expect(response.body.errorReason).to.contain(IdentityErrorReason.INCORRECT_OLDPASSWORD);
                done();
            }); 
    });

    it('should pass for an authenticated user', done => {
        const request = new ChangePasswordRequest("RandySavage", "NewPassword");
        chai.request(server)
            .post(url)
            .send(request)
            .set(Header.AUTH_TOKEN, token)
            .end((_, response) => {
                expect(response.status).to.equal(204);
                done();
            });
    });
});
