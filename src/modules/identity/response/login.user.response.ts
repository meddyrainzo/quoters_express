export default class LoginUserResponse {
    constructor(public readonly id: string, public readonly firstname: string, 
        public readonly lastname: string, public readonly email: string, public readonly token: string) { }
}
