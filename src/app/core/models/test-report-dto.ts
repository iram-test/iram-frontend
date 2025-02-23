export interface TestReportDTO {
  testReportId: string;
  name: string;
  reference: string | null;
  description: string;
  assignedUserId: string | null;
  testCaseIds: string[];
  milestoneIds: string[];
  testRunIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestReportDTO {
  name: string;
  reference?: string | null;
  description: string;
  assignedUserId?: string | null;
  testCaseIds: string[];
  milestoneIds: string[];
  testRunIds: string[];
}

export interface UpdateTestReportDTO {
  testReportId: string;
  name?: string;
  reference?: string | null;
  description?: string;
  assignedUserId?: string | null;
  testCaseIds?: string[];
  milestoneIds?: string[];
  testRunIds?: string[];
}
