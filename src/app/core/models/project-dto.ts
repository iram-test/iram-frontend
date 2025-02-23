import { Language } from "./enums/language";
import { Location } from "./enums/location";

export interface ProjectDTO {
  projectId: string;
  name: string;
  language: Language | null;
  location: Location | null;
  description: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
  users: string[];
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  language?: Language | null;
  location?: Location | null;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  language?: Language | null;
  location?: Location | null;
  managerId?: string;
  users?: string[];
}
