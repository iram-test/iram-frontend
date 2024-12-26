export interface StepDTO {
    stepId: string;
    stepDescription: string;
    expectedResult: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateStepDTO {
    stepDescription: string;
    image?: string;
    expectedResult: string;
}

export interface UpdateStepDTO {
    stepId: string;
    image?: string;
    stepDescription?: string;
    expectedResult?: string;
}