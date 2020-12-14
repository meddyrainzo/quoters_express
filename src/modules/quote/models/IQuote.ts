import { Document } from "mongoose";

export default interface IQuote extends Document {
    quote: string;
    author: string;
    posted_by: string; // id of the user that posted the quote
    likes?: string[];
    posted_on?: Date;
    comments?: number;
}