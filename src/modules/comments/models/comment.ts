import { Schema, Model, model } from "mongoose";
import IComment from "./Icomment";

const schema = new Schema({
    comment: { type: String, minlength: 1, maxlength: 250, required: true },
    quote_id: { type: String, required: true },
    posted_by: { type: String, required: true },
    posted_on: { type: Date, default: new Date() }
});

const Comment: Model<IComment> = model('comments', schema);

export default Comment;