import { MilestoneStatus } from "./enums/milestone-status";

export interface MilestoneDTO {
  milestoneID: string;
  name: string;
  parentId: string | null;
  description: string;
  startDate: string | null;
  endDate: string | null;
  status: MilestoneStatus;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  testReportId: string | null;
  testRunId: string | null;
}

export interface CreateMilestoneDTO {
  name: string;
  parentId?: string | null;
  description: string;
  startDate?: string | null;
  endDate?: string | null;
  status: MilestoneStatus;
  testReportId?: string | null;
  testRunId?: string | null;
}

export interface UpdateMilestoneDTO {
  milestoneID: string;
  name?: string;
  parentId?: string | null;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: MilestoneStatus;
  projectId?: string;
}
