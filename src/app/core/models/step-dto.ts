export interface StepDTO {
  stepId: string;
  stepDescription: string;
  expectedResult: string;
  image: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStepDTO {
  stepDescription: string;
  expectedResult: string;
  image?: string[] | null;
  testCaseId?: string;
}

export interface UpdateStepDTO {
  stepId: string;
  stepDescription?: string;
  expectedResult?: string;
  image?: string[] | null;
}
