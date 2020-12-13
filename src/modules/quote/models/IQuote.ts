import { Document } from "mongoose";

export default interface IQuote extends Document {
    quote: string;
    author: string;
    likes: string[];
    posted_by: string; // id of the user that posted the quote
    posted_on: Date;
    // TODO: Comment count
}