// project-details.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TestCaseDTO } from '../../models/test-case-dto';
import { MilestoneService } from '../../services/milestone.service';
import { TestRunService } from '../../services/test-run.service';
import { MilestoneDTO } from '../../models/milestone-dto';
import { TestRunDTO } from '../../models/test-run-dto';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.less']
})
export class ProjectDetailsComponent implements OnInit {
  testCases: TestCaseDTO[] = [];
  filteredTestCases: TestCaseDTO[] = [];
  milestones: MilestoneDTO[] = [];
  testRuns: TestRunDTO[] = [];
  projectId: string | null = '';

  constructor(
    private readonly http: HttpClient,
    private milestoneService: MilestoneService,
    private testRunService: TestRunService,
    private route: ActivatedRoute,
    private router: Router // Inject Router
  ) {
    console.log('ProjectDetailsComponent constructor');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      if (this.projectId) {
        this.loadMilestones();
        this.loadTestRuns();
      } else {
        console.error('Project ID is missing in the route parameters');
      }
    });
    this.filteredTestCases = [...this.testCases];
    console.log('TestCases initialized', this.testCases);
  }

  loadMilestones(): void {
    if (this.projectId) {
      this.milestoneService.getMilestonesByProjectId(this.projectId).subscribe(milestones => {
        this.milestones = milestones;
        console.log('Milestones завантажено:', this.milestones);
      });
    }
  }

  loadTestRuns(): void {
    if (this.projectId) {
      this.testRunService.getTestRunByProjectId(this.projectId).subscribe(testRuns => {
        this.testRuns = testRuns;
        console.log('Test Runs завантажено:', this.testRuns);
      });
    }
  }

  filterCases(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.filteredTestCases = this.testCases.filter(testCase =>
      testCase.title.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log(this.filteredTestCases);
  }
}
