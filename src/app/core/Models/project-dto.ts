export interface ProjectDTO {
    projectId: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProjectDTO {
    name: string;
    description: string;
}

export interface UpdateProjectDTO {
    projectId: string;
    name?: string;
    description?: string;
}