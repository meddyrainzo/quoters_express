import SingleCommentResponse from "./single.comment.response"

export default class CommentsResponse {
    comments: SingleCommentResponse[];

    constructor(comments: SingleCommentResponse[]) {
        this.comments = comments;
    }

}