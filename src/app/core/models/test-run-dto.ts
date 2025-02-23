export interface TestRunDTO {
  testRunId: string;
  name: string;
  milestoneIds: string[];
  assignedUserIds: string[] | null;
  projectId: string;
  testCaseIds: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestRunDTO {
  name: string;
  milestoneId?: string;
  assignedUserId?: string;
  testCaseIds: string[];
  description: string;
}

export interface UpdateTestRunDTO {
  testRunId: string;
  name?: string;
  milestoneId?: string;
  assignedUserId?: string;
  testCaseIds?: string[];
  description?: string;
}
