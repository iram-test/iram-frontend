export interface SectionDTO {
  sectionId: string;
  name: string;
  description: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionDTO {
  name: string;
  description: string;
}

export interface UpdateSectionDTO {
  sectionId: string;
  name?: string;
  description?: string;
}
