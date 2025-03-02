import {StepStatus} from "./enums/step-status";

export interface StepDTO {
  stepId: string;
  stepDescription: string;
  expectedResult: string;
  image: string[] | null;
  expectedImage: string[] | null;
  stepStatus: StepStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateStepDTO {
  stepDescription: string;
  expectedResult: string;
  expectedImage?: string[] | null;
  image?: string[] | null;
  stepStatus: StepStatus;
  testCaseId?: string;
}

export interface UpdateStepDTO {
  stepId: string;
  stepDescription?: string;
  expectedImage?: string[] | null;
  expectedResult?: string;
  image?: string[] | null;
  stepStatus?: StepStatus;
}
