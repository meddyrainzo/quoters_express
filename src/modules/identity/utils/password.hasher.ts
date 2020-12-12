import { genSalt, hash, compare } from 'bcrypt';

export default class PasswordHasher {

    static async hashPassword(password: string): Promise<string> {
        const salt = await genSalt();
        return await hash(password, salt);
    }

    static async verifyPassword(password: string, hashed: string): Promise<boolean> {
        let res = await compare(password, hashed);
        return res;
    }
}