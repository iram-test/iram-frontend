import { UserRole } from "../models/enums/user-role";

export interface UserDTO {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  role: UserRole;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  isVerified: boolean;
  lastLoginAt?: string | null;
  role: UserRole;
  refreshToken?: string | null;
}

export interface UpdateUserDTO {
  userId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isVerified?: boolean;
}
