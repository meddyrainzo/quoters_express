import { logger } from "../../../config";
import ErrorResponse from "../../../Error/error.response";
import { Result } from "../../../result";
import Quote from "../../quote/models/Quote";
import CommentErrorReason from "../../comments/comment.error.reason";
import Comment from "../models/comment";
import WriteCommentRequest from "../request/write.comment.request";
import SingleCommentResponse from "../response/single.comment.response";
import emitter from '../../emitter';
import IComment from "../models/Icomment";
import User from "../../identity/models/User";
import PostedBy from "../response/posted.by";
import CommentsResponse from "../response/comments.response";
import QuoteErrorReason from "../../quote/quote.error.reason";

export default class CommentService {

    private async createCommentResponse(comment: IComment, userId?: string): Promise<SingleCommentResponse> {

        const poster = await User.findOne({id: userId});
        const postedBy = new PostedBy(poster!.firstname, poster!.lastname)
        return this.mapQuoteToSingleCommentResponse(comment, postedBy, userId);
    }

    private mapQuoteToSingleCommentResponse(comment: IComment, postedBy: PostedBy, userId?: string): SingleCommentResponse {
        const id = comment._id.toString();
        const madeByYou = comment.posted_by === userId;
        return new SingleCommentResponse(comment.comment, postedBy, comment.quote_id, comment.posted_on!.toDateString(), madeByYou);
    }

    async getComments(quoteId: string, userId?: string): Promise<Result<CommentsResponse>> {
        try {

            // If quote does not exist, return no quote found
            const quote = await Quote.findById(quoteId);
            
            if(!quote) {
                logger.error(`No quote found with the given id ${quoteId}`);
                return { tag: 'failure', error: new ErrorResponse(400, QuoteErrorReason.NOT_FOUND) };
            }

            const comments = await Comment.find({ quote_id: quoteId });
            let commentsResponse = [];
            if (comments.length > 0) {
                for(let comment of comments) {
                    commentsResponse.push(await this.createCommentResponse(comment, userId));
                }
            }
            logger.info('Comments retrieved successfully');
            return { tag: 'success', result: new CommentsResponse(commentsResponse) };
        } catch (err)
        {
            const message = 'Failed to retrieve the comments';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, message) };
        }
    }

    async writeComment(request: WriteCommentRequest, userId: string): Promise<Result<SingleCommentResponse>> {
        try {
            const { quoteId } = request;
            const quote = await Quote.findById(quoteId);
           
            if(!quote) {
                logger.error(`No comment found with the given id ${quoteId}`);
                return { tag: 'failure', error: new ErrorResponse(404, CommentErrorReason.NOT_FOUND) };
            }
            
            const comment = await Comment.create({
                comment: request.comment,
                quote_id: quoteId,
                posted_by: userId
            });
            emitter.emit('commentCreated', quoteId, quote.comments );
            logger.info('Successfully added comment');
            const singleCommentResponse = await this.createCommentResponse(comment, userId)
            const response = singleCommentResponse;
            return { tag: 'success', result: response };
        } catch(err) {
            const message = 'Failed to write the comment';
            logger.error(message, { error_message: err.message });
            return { tag: 'failure', error: new ErrorResponse(400, message) };
        }
    }
}