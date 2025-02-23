import { TestCaseDTO } from "./test-case-dto";

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

export interface TestRunResult {
  testRunId: string;
  name: string;
  createdAt: string;
  passed: number;
  failed: number;
  blocked: number;
  untested: number;
  retested: number;
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
