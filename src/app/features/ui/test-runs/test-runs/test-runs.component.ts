import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TestRunService } from '../../../../core/services/test-run.service';
import { TestRunDTO, TestRunResult } from '../../../../core/models/test-run-dto';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {TestCaseService} from "../../../../core/services/test-case.service";
import {TestCaseDTO} from "../../../../core/models/test-case-dto";
import {Status} from "../../../../core/models/enums/status";


@Component({
  selector: 'app-test-runs',
  templateUrl: './test-runs.component.html',
  styleUrls: ['./test-runs.component.less']
})
export class TestRunsComponent implements OnInit {
  testRuns: TestRunResult[] = [];
  selectedAttribute: string = 'date';
  projectId: string;
  allTestCases: TestCaseDTO[] = []; // Store all test cases

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private testRunService: TestRunService,
    private testCaseService: TestCaseService
  ) { }

  ngOnInit(): void {
    this.route.parent.parent.params.pipe(
      switchMap(params => {
        this.projectId = params['projectId'];
        // Fetch test cases and test runs in parallel
        return forkJoin([
          this.testCaseService.getTestCasesByProjectId(this.projectId),
          this.testRunService.getTestRunByProjectId(this.projectId)
        ]);
      })
    ).subscribe(([testCases, testRuns]) => {
      this.allTestCases = testCases;
      this.testRuns = this.mapTestRunsToResults(testRuns);
      this.sortTestRuns();
    });
  }


  private mapTestRunsToResults(testRuns: TestRunDTO[]): TestRunResult[] {
    return testRuns.map(testRun => {
      const results = this.calculateTestRunResults(testRun);
      return {
        testRunId: testRun.testRunId,
        name: testRun.name,
        createdAt: testRun.createdAt,
        ...results
      };
    });
  }

  private calculateTestRunResults(testRun: TestRunDTO): { passed: number; failed: number; blocked: number; untested: number; retested: number; } {
    let passed = 0;
    let failed = 0;
    let blocked = 0;
    let untested = 0;
    let retested = 0;

    // Filter the relevant test cases for this test run
    const relevantTestCases = this.allTestCases.filter(tc => testRun.testCaseIds.includes(tc.testCaseId));

    for (const testCase of relevantTestCases) {
      switch (testCase.status) {
        case Status.PASSED:
          passed++;
          break;
        case Status.FAILED:
          failed++;
          break;
        case Status.BLOCKED:
          blocked++;
          break;
        case Status.UNTESTED:
          untested++;
          break;
        case Status.RETEST:
          retested++;
          break;
      }
    }
    return { passed, failed, blocked, untested, retested };
  }



  selectAll(): void {
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(".test-run-checkbox");
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
  }


  calculatePercentage(testRun: TestRunResult): number {
    const total = testRun.passed + testRun.failed + testRun.blocked + testRun.untested + testRun.retested;
    if (total === 0) {
      return 0;
    }
    return Math.round((testRun.passed / total) * 100);
  }


  onRemoveTestRun(testRunId: string | undefined): void {
    if (!testRunId) {
      console.error("Test Run ID is undefined. Cannot delete.");
      return;
    }

    this.testRunService.deleteTestRun(testRunId).subscribe({
      next: () => {
        // Оновлюємо список тестів після успішного видалення
        this.testRuns = this.testRuns.filter(tr => tr.testRunId !== testRunId);
      },
      error: (error) => console.error("Error deleting test run:", error)
    });
  }

  onAddTestRun(): void {
    this.router.navigate(['add-test-run'], {relativeTo: this.route.parent});
  }

  onAttributeChange(event: any): void {
    this.selectedAttribute = event.target.value;
    this.sortTestRuns();
  }

  private sortTestRuns(): void {
    if (this.selectedAttribute === 'date') {
      this.testRuns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // Add more sorting options here
  }

  goToTestRunDetails(testRunId: string): void {
    this.router.navigate(['test-run-details', testRunId], {relativeTo: this.route});
  }

  onEditTestRun(testRunId: string, event: Event): void {
    event.stopPropagation(); // Prevent navigation to details page
    this.router.navigate(['edit-test-run', testRunId], { relativeTo: this.route.parent });
  }
}
