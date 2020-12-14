import { Document } from "mongoose";

export default interface IComment extends Document {
    comment: string;
    quote_id: string;
    posted_by: string;
    posted_on?: Date;
}