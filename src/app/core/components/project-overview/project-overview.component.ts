import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from "../../models/project-entity";

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.less'
})
export class ProjectOverviewComponent implements OnInit {
  project: Project | undefined;
  projectId: string | undefined;
  loading: boolean = false;
  error: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = id;
        this.loadProject(this.projectId);
      } else {
        this.error = 'Project ID is missing';
        this.loading = false;
      }
    });
  }

  loadProject(id: string) {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load project';
        this.loading = false;
      }
    });
  }
}
