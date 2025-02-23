export interface SectionDTO {
  sectionId: string;
  name: string;
  description: string;
  subsectionIds: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionDTO {
  name: string;
  description: string;
  subsectionIds?: string[];
}

export interface UpdateSectionDTO {
  sectionId: string;
  name?: string;
  description?: string;
  subsectionIds?: string[];
}
