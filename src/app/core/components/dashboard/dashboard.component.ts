// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs'; // Import combineLatest
import { ProjectService } from '../../services/project.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Project } from "../../models/project-entity";
import { UserRole } from "../../models/enums/user-role";
import { User } from "../../models/user-entity";
import { MilestoneService } from '../../services/milestone.service'; // Import MilestoneService
import { TestRunService } from '../../services/test-run.service'; // Import TestRunService
import { TestCaseService } from '../../services/test-case.service'; // Import TestCaseService


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  errorMessage: string | null = null;
  currentUser: User | null = null;
  projectStats: { [projectId: string]: { testSuiteCount: number; activeTestRunCount: number; activeMilestoneCount: number; }; } = {}; // Store stats per project
  totalProjects = 0; // Add a variable to track total projects
  activeProjects = 0;
  completedProjects = 0;

  constructor(
    private readonly router: Router,
    private projectService: ProjectService,
    private authService: AuthenticationService,
    private milestoneService: MilestoneService, // Inject
    private testRunService: TestRunService,    // Inject
    private testCaseService: TestCaseService    // Inject
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Current User:", this.currentUser); // Keep this for debugging
    });
  }


  loadProjects() {
    this.loading = true;
    this.errorMessage = null;

    this.projectService.getProjects()
      .pipe(
        catchError(err => {
          this.errorMessage = err.message || 'Failed to load projects';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe(projects => {
        this.projects = projects;
        this.totalProjects = projects.length;  // Store the number of projects
        this.loading = false;
        this.loadProjectStatistics(projects); // Load stats *after* loading projects
        this.activeProjects = this.projects.length;
      });
  }

  loadProjectStatistics(projects: Project[]) {
    projects.forEach(project => {
      const testCases$ = this.testCaseService.getTestCasesByProjectId(project.projectId);
      const testRuns$ = this.testRunService.getTestRunByProjectId(project.projectId);
      const milestones$ = this.milestoneService.getMilestonesByProjectId(project.projectId);

      combineLatest([testCases$, testRuns$, milestones$])
        .pipe(
          catchError(error => {
            console.error(`Error loading statistics for project ${project.projectId}:`, error);
            return of([[], [], []]); // Return empty arrays on error
          })
        )
        .subscribe(([testCases, testRuns, milestones]) => {
          // Count test suites (assuming each test case belongs to a suite, and no duplicates)
          const testSuiteCount = testCases.length;  // Simple count for now.  Improve if needed.

          // Count active test runs.  You might need to add a 'status' field to TestRunDTO.
          const activeTestRunCount = testRuns.length; // Assuming all are active for now

          // Count active milestones. You might need to add a 'status' field to MilestoneDTO
          const activeMilestoneCount = milestones.filter(m => m.status === 'Open').length;  // Example, adjust 'Active'

          this.projectStats[project.projectId] = {
            testSuiteCount,
            activeTestRunCount,
            activeMilestoneCount
          };
        });
    });
  }



  navigateToProjectDetails(projectId: string) {
    this.router.navigate(['/project-details', projectId]);
  }

  navigateEditProject(projectId: string) {
    //No changes needed here, the route guard will handle preventing access
    this.router.navigate(['/edit-project', projectId]);
  }

  deleteProject(projectId: string): void {
    // if (this.currentUser && (this.currentUser.role === 'User')) {
      if (confirm('Are you sure you want to delete this project?')) {
        this.projectService.deleteProject(projectId).subscribe({
          next: () => {
            // Reload projects after successful deletion
            this.router.navigate(['/dashboard']);
            this.loadProjects();
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to delete project';
          }
        });
      // }
    }
  }


  addProject() {
    this.router.navigate(['/add-project']);
  }

  // Helper method to check if the user has the required role
  hasRequiredRole(): boolean {
    return this.currentUser !== null && (this.currentUser.role === 'Admin' || this.currentUser.role === UserRole.MANAGER);
  }
}
