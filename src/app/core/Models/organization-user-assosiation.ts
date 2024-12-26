import { UserRole } from "./enums/user-role"; 
import { UserPermission } from "./enums/user-permission"; 

export interface OrganizationUserAssociationDTO {
    associationId: string;
    userId: string;
    organizationId: string;
    role: UserRole;
    permission: UserPermission;
    assignedAt: Date;
}

export interface CreateOrganizationUserAssociationDTO {
    userId: string;
    organizationId: string;
    role: UserRole;
    permission: UserPermission;
}

export interface UpdateOrganizationUserAssociationDTO {
    associationId: string;
    role?: UserRole;
    permission?: UserPermission;
}