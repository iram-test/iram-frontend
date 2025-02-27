import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CreateProjectDTO, ProjectDTO } from '../../models/project-dto';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrl: './add-edit-project.component.less'
})
export class AddEditProjectComponent implements OnInit {
  projectForm: FormGroup;
  id: string | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.loading = true;
        this.projectService.getProject(this.id)
          .subscribe({
            next: (project: ProjectDTO) => {
              this.projectForm.patchValue(project);
              this.loading = false;
            },
            error: (error) => {
              this.errorMessage = error.message || 'Failed to load project';
              this.loading = false;
            }
          });
      }
    });
  }

  sendData(data: any): void {
    this.loading = true;
    this.errorMessage = null;

    const projectDto: CreateProjectDTO = {
      name: data.name,
      description: data.description
    };

    if (!this.id) {
      this.projectService.createProject(projectDto)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to create project';
            this.loading = false;
          }
        });
    } else {
      this.projectService.updateProject(this.id, projectDto)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to update project';
            this.loading = false;
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
