export interface TestReportDTO {
    testReportId: string;
    name: string;
    reference: string | null;
    milestoneId: string | null;
    description: string;
    assignedUserId: string | null;
    testCaseId: string[];
    folderId: string | null;
}

export interface CreateTestReportDTO {
    name: string;
    reference?: string | null;
    milestoneId?: string | null;
    description: string;
    assignedUserId?: string | null;
    testCaseId: string[];
    folderId?: string | null;
}

export interface UpdateTestReportDTO {
    testReportId: string;
    name?: string;
    reference?: string | null;
    milestoneId?: string | null;
    description?: string;
    assignedUserId?: string | null;
    testCaseId?: string[];
    folderId?: string | null;
}