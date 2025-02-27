interface HierarchyTestCase {
    testCaseId: string;
    title: string;
}

export interface HierarchyItem {
    id: string;
    name: string;
    type: 'section' | 'subsection' | 'testCase' | 'project';
    children?: HierarchyItem[];
    expanded?: boolean;
    projectId: string;
    testCases?: HierarchyTestCase[];
}
