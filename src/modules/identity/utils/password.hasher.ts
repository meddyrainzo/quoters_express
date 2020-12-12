import { genSalt, hash, compare } from 'bcrypt';

export default class PasswordHasher {

    static async hashPassword(password: string): Promise<string> {
        var salt = await genSalt();
        return await hash(password, salt);
    }

    static async verifyPassword(password: string, hashed: string): Promise<boolean> {
        return await compare(password, hashed);
    }
}