import { Component, OnInit } from '@angular/core';
import { TestCase } from '../../../../core/models/test-case-entity';
import { HttpClient } from '@angular/common/http';
import { TemplateType } from '../../../../core/models/enums/template-type';
import { TestType } from '../../../../core/models/enums/test-type';
import { Priority } from '../../../../core/models/enums/project-priority';
import { Status } from '../../../../core/models/enums/status';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrl: './test-cases.component.less'
})
export class TestCasesComponent implements OnInit {
  testCases: TestCase[];


  constructor(private readonly http: HttpClient) { }

  isTestCasesEmpty() {
    return this.testCases.length === 0;
  }

  ngOnInit(): void {
    //Later here will be logic with httpClient
    // const testCase: TestCaseDTO = {
    //   testCaseId: '',
    //   title: 'Test Case',
    //   collection: '',
    //   folderId: '',
    //   templateType: TemplateType.STEPS,
    //   testType: TestType.ACCESSIBILITY,
    //   priority: Priority.LOW,
    //   description: '',
    //   timeEstimation: '',
    //   reference: '',
    //   createdAt: undefined,
    //   updatedAt: undefined,
    //   projectId: '',
    //   status: Status.PASSED,
    //   assignedUserId: '',
    //   comment: '',
    //   elapsedTime: '',
    //   defects: '',
    //   version: '',
    //   step: []
    // };
    // this.testCases = [testCase];
    this.testCases = [];
  }
}
