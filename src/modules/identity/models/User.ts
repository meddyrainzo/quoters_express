import { Schema, Model, model } from 'mongoose';

import IUser from './IUser';

const userSchema = new Schema({
    firstname: { type: String, minlength: 1, maxlength: 25, required: true },
    lastname: { type: String, minlength: 1, maxlength: 25, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 6, maxlength: 125, required: true },
    registered_on: { type: Date, default: new Date() }
});

const User: Model<IUser> = model('users', userSchema);

export default User;