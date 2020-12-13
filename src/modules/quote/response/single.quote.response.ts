export default class SingleQuoteResponse {
    constructor(public readonly id: string, public readonly quote: string, public readonly author: string,
         public readonly postedBy: string, public readonly postedOn: string, public readonly likesCount: number, 
         public readonly likedByYou: boolean  ) { }
}