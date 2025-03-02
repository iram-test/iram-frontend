// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { TemplateType } from '../../../../core/models/enums/template-type';
// import { TestType } from '../../../../core/models/enums/test-type';
// import { Priority } from '../../../../core/models/enums/project-priority';
// import { TestCaseDTO } from '../../../../core/models/test-case-dto';
//
// @Component({
//   selector: 'app-test-cases',
//   templateUrl: './test-cases.component.html',
//   styleUrl: './test-cases.component.less'
// })
// export class TestCasesComponent implements OnInit {
//   testCases: TestCaseDTO[];
//   filteredTestCases: TestCaseDTO[];
//
//   constructor(private readonly http: HttpClient) {
//     console.log('TestCasesComponent constructor');
//   }
//
//   isTestCasesEmpty() {
//     console.log('isTestCasesEmpty called', this.testCases);
//     return this.testCases.length === 0;
//   }
//
//   ngOnInit(): void {
//     //Later here will be logic with httpClient
//     const testCase1: TestCaseDTO = {
//       testCaseId: 'ID',
//       title: 'Title',
//       sectionId: '',
//       projectId: '',
//       assignedUserId: '',
//       templateType: TemplateType.STEPS,
//       testType: TestType.ACCESSIBILITY,
//       priority: Priority.LOW,
//       timeEstimation: '',
//       description: '',
//       stepIds: [],
//       createdAt: '',
//       updatedAt: ''
//     };
//
//     const testCase2: TestCaseDTO = {
//       testCaseId: 'CS2',
//       title: 'Iram test case',
//       sectionId: '',
//       projectId: '',
//       assignedUserId: '',
//       templateType: TemplateType.STEPS,
//       testType: TestType.ACCESSIBILITY,
//       priority: Priority.LOW,
//       timeEstimation: '',
//       description: '',
//       stepIds: [],
//       createdAt: '',
//       updatedAt: ''
//     }
//
//     this.testCases = [testCase1, testCase2];
//     this.filteredTestCases = [...this.testCases];
//     // this.testCases = [];
//     console.log('TestCases initialized', this.testCases);
//   }
//
//   filterCases(event: Event) {
//     const searchText = (event.target as HTMLInputElement).value;
//     // console.log(searchText);
//     this.filteredTestCases = this.testCases.filter(testCase =>
//       testCase.title.toLowerCase().includes(searchText.toLowerCase())
//     );
//     console.log(this.filteredTestCases);
//   }
// }
