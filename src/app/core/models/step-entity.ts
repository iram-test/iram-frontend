import {StepStatus} from "./enums/step-status";

export class Step {
  constructor(
    public stepId: string,
    public stepDescription: string,
    public expectedResult: string,
    public image: string[] | null,
    public expectedImage: string[] | null,
    public stepStatus: StepStatus,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
