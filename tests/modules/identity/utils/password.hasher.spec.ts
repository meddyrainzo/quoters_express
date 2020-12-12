import { expect } from 'chai';
import PasswordHasher from '../../../../src/modules/identity/utils/password.hasher';


describe('Password hashing and verification test', () => {
    it('should hash password successfully', async () => {
        var password = "Password";
        var hashed = await PasswordHasher.HashPassword(password);
        
        expect(hashed).is.not.equal(password);
        expect(hashed).is.not.empty;
    });

    it('should always return a unique hash even if the password does not change', async () => {
        const password = 'Password';

        const firstHash = await PasswordHasher.HashPassword(password);
        const secondHash = await PasswordHasher.HashPassword(password);

        expect(firstHash).to.not.be.eq(secondHash);
    });

    it('Should verify a correct password successfully', async () => {
        const password = 'Password';
        const hashedPassword = await PasswordHasher.HashPassword(password);
        const isPasswordCorrect = await PasswordHasher.VerifyPassword(password, hashedPassword);

        expect(isPasswordCorrect).to.be.true;
    });

    it('Should return false when a wrong password is verified', async () => {
        const password = 'Password';
        const wrongPassword = "Wrong";
        const hashedPassword = await PasswordHasher.HashPassword(password);
        const isPasswordCorrect = await PasswordHasher.VerifyPassword(password, hashedPassword);

        expect(isPasswordCorrect).to.not.equal(wrongPassword);
    })
})