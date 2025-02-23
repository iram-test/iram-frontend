export class Step {
  constructor(
    public stepId: string,
    public stepDescription: string,
    public expectedResult: string,
    public image: string[] | null,
    public createdAt: string,
    public updatedAt: string,
  ) { }
}
