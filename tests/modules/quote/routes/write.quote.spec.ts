// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import ErrorReasons from '../../../../src/Error/error.reasons';
// import Header from '../../../../src/header';
// import server from '../../../../src/server';
// import WriteQuoteRequest from '../../../../src/modules/quote/requests/write.quote.request';
// import LoginUserRequest from '../../../../src/modules/identity/requests/login.user.request';

// chai.use(chaiHttp);

// const url = '/quotes';
// const quote = 'I remember I was conflicted. Misusing my influence'
// const author = 'Kendrick Lamar';
// const goodRequest = new WriteQuoteRequest(quote, author);

// let token: string;

// before(done => {
//     server.on('listening', () => {
//         const request = new LoginUserRequest('randy@savage.com', 'RandySavage')
//         chai.request(server).post('/identity/login').send(request).end((_, res) =>{
//             token = res.get(Header.AUTH_TOKEN);
//             done();
//         });
//     })     
// });

// describe('Test writing quotes', () => {    
//     it('should fail if the user is not authenticated', done => {
//         chai.request(server)
//             .post(url)
//             .send(goodRequest)
//             .end((_, response) => {
//                 expect(response.status).to.equal(401);
//                 expect(response.body).to.have.property('errorReason');
//                 expect(response.body.errorReason).to.contain(ErrorReasons.UNAUTHORIZED);
//                 done();
//             });
//     });

//     it('should fail if the request is invalid', done => {
//         const request = { quote: 'Bad quote' };

//         chai.request(server)
//             .post(url)
//             .send(request)
//             .set(Header.AUTH_TOKEN, token)
//             .end((_, response) => {
//                 expect(response.status).to.equal(400);
//                 expect(response.body).to.have.property('errorReason');
//                 expect(response.body.errorReason).to.contain(`The author ${ErrorReasons.REQUIRED}`);
//                 done();
//             });
//     });

//     it('should write a quote successfully if the request is valid and user authenticated', done => {
//         chai.request(server)
//             .post(url)
//             .send(goodRequest)
//             .set(Header.AUTH_TOKEN, token)
//             .end((_, response) => {
//                 expect(response.status).to.equal(201);
//                 expect(response.body).to.have.property('quote', quote);
//                 expect(response.body).to.have.property('author', author);
//                 done();
//             });
//     });

// });
