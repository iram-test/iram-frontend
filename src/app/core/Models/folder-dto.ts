export interface FolderDTO {
    folderId: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
}

export interface CreateFolderDTO {
    name: string;
    description: string;
    projectId: string;
}

export interface UpdateFolderDTO {
    folderId: string;
    name?: string;
    description?: string;
}