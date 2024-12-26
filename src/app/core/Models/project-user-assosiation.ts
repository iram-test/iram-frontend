import { ProjectRole } from "./enums/project-role";

export interface ProjectUserAssociationDTO {
    associationId: string;
    projectId: string;
    userId: string;
    projectRole: ProjectRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProjectUserAssociationDTO {
    projectId: string;
    userId: string;
    projectRole: ProjectRole;
}

export interface UpdateProjectUserAssociationDTO {
    associationId: string;
    projectRole?: ProjectRole;
}