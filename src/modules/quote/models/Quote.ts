import { Schema, Model, model } from 'mongoose';
import IQuote from './IQuote';

const quoteSchema = new Schema({
    quote: { type: String, required: true, minlength: 1, maxlength: 250 },
    author: { type: String, maxlength: 50, default: 'Unknown' },
    likes: [{ type: String, default: '' }],
    posted_by: { type: String, maxlength: 225, required: true },
    posted_on: { type: Date, default: new Date() }
});

const Quote: Model<IQuote> = model('quotes', quoteSchema);

export default Quote;