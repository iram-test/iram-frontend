import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {ActivatedRoute, Router} from '@angular/router';

import {forkJoin, Subscription, switchMap} from 'rxjs';
import {TestRunService} from "../../../../core/services/test-run.service";
import {TestCaseService} from "../../../../core/services/test-case.service";
import {TestRunDTO} from "../../../../core/models/test-run-dto";
import {TestCaseDTO} from "../../../../core/models/test-case-dto";
import {UserService} from "../../../../core/services/user.service";
import {UserDTO} from "../../../../core/models/user-dto";
import {Status} from "../../../../core/models/enums/status";
import {AddEditTestResultComponent} from "../add-edit-test-result/add-edit-test-result.component";

Chart.register(...registerables);

interface TestCaseWithAssignedTo extends TestCaseDTO {
  assignedToName?: string;
}

@Component({
  selector: 'app-test-run-summary',
  templateUrl: './test-run-details.component.html',
  styleUrls: ['./test-run-details.component.less']
})
export class TestRunDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  chart: any;
  testRun: TestRunDTO;
  testCases: TestCaseWithAssignedTo[] = [];
  passedCount = 0;
  failedCount = 0;
  blockedCount = 0;
  retestCount = 0;
  untestedCount = 0;
  totalTests = 0;
  passedPercentage = 0;
  untestedPercentage = 0; // Додаємо нову змінну для відсотку непройдених тестів
  private routeSubscription: Subscription;
  users: UserDTO[] = [];
  private testResultUpdateSubscription: Subscription; // Subscription for the static event
  sortDirection: 'asc' | 'desc' = 'asc'; // Зберігаємо поточний напрямок сортування
  sortField: string = 'title'; // Зберігаємо поточне поле сортування

  constructor(
    private route: ActivatedRoute,
    private testRunService: TestRunService,
    private testCaseService: TestCaseService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const testRunId = params.get('id')!;
        return forkJoin({
          testRun: this.testRunService.getTestRun(testRunId),
          testCases: this.testCaseService.getTestCases(),
          users: this.userService.getUsersByTestRun(testRunId) // Use the new method
        });
      })
    ).subscribe({
      next: ({ testRun, testCases, users }) => {
        this.testRun = testRun;
        this.users = users;
        this.testCases = testCases.filter(tc => testRun.testCaseIds.includes(tc.testCaseId));
        this.testCases = this.testCases.map(testCase => {
          const assignedUser = this.users.find(user => user.userId === testCase.assignedUserId);
          return {
            ...testCase,
            assignedToName: assignedUser ? assignedUser.email : 'Unassigned' // Show the email instead of full name
          };
        });
        this.calculateStats();
        this.sortTestCases(); // Сортуємо початково
        if (this.chart) {
          this.updateChartData();
        }
      },
      error: error => console.error("Error loading test run details:", error)
    });

    // Subscribe to the static event emitter
    this.testResultUpdateSubscription = AddEditTestResultComponent.testResultUpdated.subscribe(() => {
      this.refreshData(); // Refresh the data when the event is emitted
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
    this.testResultUpdateSubscription?.unsubscribe(); // Unsubscribe to prevent memory leaks!
  }
  refreshData() {
    forkJoin({
      testRun: this.testRunService.getTestRun(this.testRun.testRunId),
      testCases: this.testCaseService.getTestCases(),
      users: this.userService.getUsersByTestRun(this.testRun.testRunId)
    }).subscribe({
      next: ({ testRun, testCases, users }) => {
        this.testRun = testRun;
        this.users = users;
        this.testCases = testCases.filter(tc => testRun.testCaseIds.includes(tc.testCaseId));
        this.testCases = this.testCases.map(testCase => {
          const assignedUser = this.users.find(user => user.userId === testCase.assignedUserId);
          return {
            ...testCase,
            assignedToName: assignedUser ? assignedUser.email : 'Unassigned' // Show the email instead of full name
          };
        });
        this.calculateStats();
        this.sortTestCases(); // Сортуємо після оновлення даних
        if (this.chart) {
          this.updateChartData();
        }
      },
      error: error => console.error("Error refreshing test run details:", error)
    });
  }

  calculateStats() {
    this.passedCount = this.testCases.filter(tc => tc.status === Status.PASSED).length;
    this.blockedCount = this.testCases.filter(tc => tc.status === Status.BLOCKED).length;
    this.failedCount = this.testCases.filter(tc => tc.status === Status.FAILED).length;
    this.retestCount = this.testCases.filter(tc => tc.status === Status.RETEST).length;
    this.untestedCount = this.testCases.filter(tc => tc.status === Status.UNTESTED).length;
    this.totalTests = this.testCases.length;
    this.passedPercentage = this.totalTests > 0 ? (this.passedCount / this.totalTests) * 100 : 0;
    this.untestedPercentage = this.totalTests > 0 ? (this.untestedCount / this.totalTests) * 100 : 0; // Обчислюємо відсоток непройдених тестів

    if (this.chart) {
      this.updateChartData();
    }
  }

  createChart() {
    this.chart = new Chart('testRunSummaryChart', {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Retest', 'Untested'],
        datasets: [{
          label: 'Test Results',
          data: [this.passedCount, this.failedCount, this.retestCount, this.untestedCount],
          backgroundColor: [
            '#4CAF50',
            '#F44336',
            '#F4C500',
            '#9E9E9E'
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          }
        }
      }
    });
  }

  updateChartData() {
    this.chart.data.datasets[0].data = [this.passedCount, this.failedCount, this.retestCount, this.untestedCount];
    this.chart.update();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Passed': return 'status passed';
      case 'Failed': return 'status failed';
      case 'Retest': return 'status failed'; // Typo fixed here
      case 'Untested': return 'status untested';
      default: return 'status';
    }
  }

  getPercentageText(status: string): string {
    let count = 0;
    switch (status) {
      case 'Passed': count = this.passedCount; break;
      case 'Failed': count = this.failedCount; break;
      case 'Retest': count = this.retestCount; break;
      case 'Untested': count = this.untestedCount; break;
    }
    const percentage = this.totalTests > 0 ? (count / this.totalTests) * 100 : 0;
    return `${percentage.toFixed(0)}% set to ${status}`;
  }

  getCount(status: string): number {
    switch (status) {
      case 'Passed': return this.passedCount;
      case 'Failed': return this.failedCount;
      case 'Retest': return this.retestCount;
      case 'Untested': return this.untestedCount;
      default: return 0;
    }
  }

  navigateAddTestResult(testCaseId: string) {
    this.router.navigate(
      ['add-test-result', testCaseId],
      { relativeTo: this.route }
    );
  }

  // Функція для сортування testCases
  sortTestCases() {
    this.testCases.sort((a, b) => {
      const isAsc = this.sortDirection === 'asc';
      return this.compare(a.title, b.title, isAsc);
    });
  }

  // Функція порівняння
  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Обробник кліку на кнопку сортування
  onSortClick() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortTestCases();
  }
}
