import { Status } from "./enums/status";

export class TestRunDTO {
    testRunId: string;
    status: Status;
    comment: string;
    version: string;
    elapsed: string;
    defects: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    constructor({
        testRunId,
        status,
        comment,
        version,
        elapsed,
        defects,
        description,
        createdAt,
        updatedAt,
    }: TestRunDTO) {
        this.testRunId = testRunId;
        this.status = status;
        this.comment = comment;
        this.version = version;
        this.elapsed = elapsed;
        this.defects = defects;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export interface CreateTestRunDTO {
    status: Status;
    comment: string;
    version: string;
    elapsed: string;
    defects: string;
    description: string;
}
export interface UpdateTestRunDTO {
    status?: Status;
    comment?: string;
    version?: string;
    elapsed?: string;
    defects?: string;
    description?: string;
}