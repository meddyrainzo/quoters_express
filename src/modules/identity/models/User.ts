import { Schema, Model, model } from 'mongoose';

import IUser from './IUser';

const userSchema = new Schema({
    firstname: { type: String, minlength: 1, maxlength: 25, required: true },
    lastname: { type: String, minlength: 1, maxlength: 25, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 6, maxlength: 250, required: true },
    registered_on: { type: Date, default: new Date().getUTCDate() }
});

const User: Model<IUser> = model('User', userSchema);

export default User;