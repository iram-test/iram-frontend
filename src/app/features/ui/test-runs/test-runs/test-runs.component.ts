import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TestRun } from '../../../../core/models/test-run-entity';

@Component({
  selector: 'app-test-runs',
  templateUrl: './test-runs.component.html',
  styleUrl: './test-runs.component.less'
})
export class TestRunsComponent implements OnInit {
  testRuns: TestRun[];
  constructor(private readonly http: HttpClient) { }

  isTestRunsEmpty() {
    return this.testRuns.length === 0;
  }

  ngOnInit(): void {
    //Later here will be logic with httpClient
    const testRun: TestRun = {
      testRunId: '',
      name: 'Test Run 1',
      milestoneId: '',
      assignedUserId: '',
      projectId: '',
      testCaseIds: [],
      description: '',
      createdAt: '',
      updatedAt: ''
    };
    this.testRuns = [testRun];
    // this.testRuns = [];
  }
}
