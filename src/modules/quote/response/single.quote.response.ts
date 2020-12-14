import PostedBy from "./posted.by";

export default class SingleQuoteResponse {
    constructor(public readonly id: string, public readonly quote: string, public readonly author: string,
         public readonly postedBy: PostedBy, public readonly postedOn: string, public readonly likesCount: number, 
         public readonly likedByYou: boolean, public readonly comments: number ) { }
}