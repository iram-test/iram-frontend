export class TestRun {
    constructor(
        public testRunId: string,
        public name: string,
        public milestoneId: string | null,
        public assignedUserId: string | null,
        public projectId: string,
        public testCaseIds: string[],
        public description: string,
        public createdAt: string, // ISO string
        public updatedAt: string, // ISO string
    ) { }
}