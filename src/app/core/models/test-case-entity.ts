import { TemplateType } from "./enums/template-type";
import { TestType } from "./enums/test-type";
import { Priority } from "./enums/project-priority";
import { Status } from "./enums/status";

export class TestCase {
  constructor(
    public testCaseId: string,
    public title: string,
    public sectionId: string | null,
    public projectId: string,
    public assignedUserId: string | null,
    public templateType: TemplateType,
    public testType: TestType,
    public priority: Priority,
    public status: Status,
    public timeEstimation: string,
    public description: string,
    public stepIds: string[] | null,
    public createdAt: string,
    public updatedAt: string,
  ) { }
}