import { Language } from "./enums/language";
import { Location } from "./enums/location";

export class Project {
    constructor(
        public projectId: string,
        public name: string,
        public language: Language | null,
        public location: Location | null,
        public description: string,
        public managerId: string,
        public createdAt: string,
        public updatedAt: string,
        public users: string[] = [],
    ) { }
}