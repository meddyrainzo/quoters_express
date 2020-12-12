import { Document } from 'mongoose';

export default interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    registered_on: Date;
}