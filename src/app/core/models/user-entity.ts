import { UserRole } from "./enums/user-role";

export class User {
  constructor(
    public userId: string,
    public firstName: string,
    public lastName: string,
    public username: string,
    public email: string,
    public password: string,
    public isVerified: boolean,
    public createdAt: string,
    public updatedAt: string,
    public lastLoginAt: string | null,
    public refreshToken: string | null,
    public role: UserRole,
  ) { }
}
