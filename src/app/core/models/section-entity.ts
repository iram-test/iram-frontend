export class Section {
  constructor(
    public sectionId: string,
    public name: string,
    public description: string,
    public subsectionIds: string[] | null,
    public createdAt: string,
    public updatedAt: string,
  ) { }
}
