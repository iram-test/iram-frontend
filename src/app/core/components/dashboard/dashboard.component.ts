import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Project } from "../../models/project-entity";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(private readonly router: Router, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
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
        this.loading = false;
      });
  }

  navigateProjectOverview(projectId: string) {
    this.router.navigate(['/project-overview', projectId]);
  }

  navigateEditProject(projectId: string) {
    this.router.navigate(['/edit-project', projectId]);
  }

  addProject() {
    this.router.navigate(['/add-project']);
  }
}
