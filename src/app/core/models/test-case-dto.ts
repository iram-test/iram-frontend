import { TemplateType } from "../models/enums/template-type";
import { Priority } from "../models/enums/project-priority";
import { TestType } from "../models/enums/test-type";

export interface TestCaseDTO {
  testCaseId: string;
  title: string;
  sectionId: string | null;
  projectId: string;
  assignedUserId: string | null;
  templateType: TemplateType;
  testType: TestType;
  priority: Priority;
  timeEstimation: string;
  description: string;
  stepIds: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestCaseDTO {
  title: string;
  sectionId?: string | null;
  assignedUserId?: string;
  templateType: TemplateType;
  testType: TestType;
  priority: Priority;
  timeEstimation: string;
  description: string;
  stepIds?: string[] | null;
}

export interface UpdateTestCaseDTO {
  testCaseId: string;
  title?: string;
  sectionId?: string | null;
  projectId?: string;
  assignedUserId?: string;
  templateType?: TemplateType;
  testType?: TestType;
  priority?: Priority;
  timeEstimation?: string;
  description?: string;
  stepIds?: string[] | null;
}
