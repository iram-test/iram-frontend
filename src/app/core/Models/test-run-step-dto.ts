import { Status } from "./enums/status";

export class TestRunStepDTO {
    testRunStepId: string;
    stepId: string;
    status: Status;
    resultDescription: string | undefined;
    createdAt: Date;
    updatedAt: Date;

    constructor({
        testRunStepId,
        stepId,
        status,
        resultDescription,
        createdAt,
        updatedAt,
    }: TestRunStepDTO) {
        this.testRunStepId = testRunStepId;
        this.stepId = stepId;
        this.status = status;
        this.resultDescription = resultDescription;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export interface CreateTestRunStepDTO {
    stepId: string;
    status: Status;
    resultDescription?: string;
}

export interface UpdateTestRunStepDTO {
    status?: Status;
    resultDescription?: string;
}