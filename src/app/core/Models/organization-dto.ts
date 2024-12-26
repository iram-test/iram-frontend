export interface OrganizationDTO {
    organizationId: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
}

export interface CreateOrganizationDTO {
    name: string;
    description: string;
    projectId: string;
}

export interface UpdateOrganizationDTO {
    organizationId: string;
    name?: string;
    description?: string;
}