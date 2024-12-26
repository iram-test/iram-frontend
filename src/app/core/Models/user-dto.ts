import { UserPermission } from "./enums/user-permission";
import { UserRole } from "./enums/user-role";
export interface UserDTO {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
}
export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password?: string;
    isVerified: boolean;
    lastLoginAt: Date | null;
    activationLink?: string;
    role: UserRole;
    permissions: UserPermission[];
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    permissions?: UserPermission[];
}