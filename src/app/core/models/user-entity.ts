import { UserRole } from "./enums/user-role";

export class User {
    constructor(
        public email: string,
        public password: string
    ) { }
}