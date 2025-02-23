export class TestReport {
  constructor(
    public testReportId: string,
    public name: string,
    public reference: string | null,
    public description: string,
    public assignedUserId: string | null,
    public testCaseIds: string[],
    public milestoneIds: string[],
    public testRunIds: string[],
    public projectId: string,
    public createdAt: string,
    public updatedAt: string,
  ) { }
}
