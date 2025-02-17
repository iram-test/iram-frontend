import { MilestoneStatus } from "./enums/milestone-status";

export class Milestone {
    constructor(
        public milestoneID: string,
        public name: string,
        public parentId: string | null,
        public description: string,
        public startDate: string | null,
        public endDate: string | null,
        public status: MilestoneStatus,
        public projectId: string,
        public testReportId: string | null,
        public testRunId: string | null,
        public createdAt: string,
        public updatedAt: string,
    ) { }
}