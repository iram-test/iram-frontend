import { Component, OnInit } from '@angular/core';
import { TestRunDTO } from '../../../../core/models/test-run-dto'; // Adjust the path if necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-runs',
  templateUrl: './test-runs.component.html',
  styleUrls: ['./test-runs.component.less']
})
export class TestRunsComponent implements OnInit {
  testRuns: TestRunDTO[] = [];
  selectedAttribute: string = 'date';

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    this.testRuns = [
      {
        testRunId: '1',
        name: 'Test Run 1/5/2025',
        milestoneIds: [],
        assignedUserIds: null,
        projectId: 'ProjectA',
        testCaseIds: ['TC1', 'TC2', 'TC3'],
        description: 'Description for Test Run 1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        testRunId: '2',
        name: 'Another Test Run',
        milestoneIds: [],
        assignedUserIds: null,
        projectId: 'ProjectB',
        testCaseIds: ['TC4', 'TC5', 'TC6', 'TC7', 'TC8'],
        description: 'Description for Test Run 2',
        createdAt: '2023-12-20',
        updatedAt: '2024-01-10'
      }
    ];
  }

  isTestRunsEmpty(): boolean {
    return this.testRuns.length === 0;
  }

  state = 0;
  selectAll(): void {
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[type='checkbox']");
    if (this.state === 0) {
      checkboxes.forEach(checkbox => checkbox.checked = true);
      this.state = 1;
    }
    else {
      checkboxes.forEach(checkbox => checkbox.checked = false);
      this.state = 0;
    }
  }

  calculatePassed(testRun: TestRunDTO): number {
    // return Math.floor(Math.random() * testRun.testCaseIds.length);
    return 3;
  }

  calculateBlocked(testRun: TestRunDTO): number {
    // const passed = this.calculatePassed(testRun);
    // return Math.floor(Math.random() * (testRun.testCaseIds.length - passed));
    return 0;
  }

  calculateUntested(testRun: TestRunDTO): number {
    // const passed = this.calculatePassed(testRun);
    // const blocked = this.calculateBlocked(testRun);
    // return Math.floor(Math.random() * (testRun.testCaseIds.length - passed - blocked));
    return 0;
  }

  calculateRetest(testRun: TestRunDTO): number {
    // const passed = this.calculatePassed(testRun);
    // const blocked = this.calculateBlocked(testRun);
    // const untested = this.calculateUntested(testRun);
    // return Math.floor(Math.random() * (testRun.testCaseIds.length - passed - blocked - untested));
    return 0;
  }

  calculateFailed(testRun: TestRunDTO): number {
    // const passed = this.calculatePassed(testRun);
    // const blocked = this.calculateBlocked(testRun);
    // const untested = this.calculateUntested(testRun);
    // const retest = this.calculateRetest(testRun);
    // return testRun.testCaseIds.length - passed - blocked - untested - retest;
    return 1;
  }

  calculatePercentage(testRun: TestRunDTO): number {
    const totalTestCases = testRun.testCaseIds.length;
    if (totalTestCases === 0) return 0;
    const passed = this.calculatePassed(testRun);
    return Math.round((passed / totalTestCases) * 100);
  }

  onEditTestRun(testRunId: string): void {
    console.log(`Edit clicked for testRunId: ${testRunId}`);
  }

  onRemoveTestRun(testRunId: string): void {
    console.log(`Remove clicked for testRunId: ${testRunId}`);
    this.testRuns = this.testRuns.filter(tr => tr.testRunId !== testRunId);
  }

  onAddTestRun(): void {
    this.router.navigate(['add-test-run']);
  }

  onAttributeChange(event: any): void {
    this.selectedAttribute = event.target.value;
    console.log(`Order by attribute changed to: ${this.selectedAttribute}`);
  }

  getResultsLine(testRun: TestRunDTO): string {
    const passed = this.calculatePassed(testRun);
    const blocked = this.calculateBlocked(testRun);
    const untested = this.calculateUntested(testRun);
    const retest = this.calculateRetest(testRun);
    const failed = this.calculateFailed(testRun);

    return `${passed} Passed, ${blocked} Blocked, ${untested} Untested, ${retest} Retest and ${failed} Failed.`;
  }
}