export interface SubsectionDTO {
  subsectionId: string;
  name: string;
  description: string;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubsectionDTO {
  name: string;
  description: string;
  sectionId: string;
}

export interface UpdateSubsectionDTO {
  subsectionId: string;
  name?: string;
  description?: string;
  sectionId?: string;
}
