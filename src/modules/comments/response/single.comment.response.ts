import PostedBy from './posted.by';

export default class SingleCommentResponse {
    constructor(public readonly comment: string, public readonly postedBy: PostedBy, public readonly quoteId: string,
                 public readonly postedOn: string, public readonly madeByYou: boolean) { }
}