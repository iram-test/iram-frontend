// add-edit-project.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service'; // Import UserService
import { CreateProjectDTO, ProjectDTO, UpdateProjectDTO } from '../../models/project-dto';
import { Location } from '../../models/enums/location';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {AuthenticationService} from "../../services/authentication.service"; // Import forkJoin

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.less']
})
export class AddEditProjectComponent implements OnInit {
  locations = Object.values(Location);
  projectForm: FormGroup;
  id: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  projectId: string | null = null;
  projectUsers: string[] = []; // To store user IDs associated with the project
  userNames: { [userId: string]: string } = {};
  public canModify = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthenticationService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      'user-id': [''], // No longer required by default
      location: [null, Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.role && user.role !== 'User') {
        this.canModify = true;
      } else {
        this.canModify = false;
      }
    });

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.projectId = this.id;
        this.loading = true;

        // Use forkJoin to load both project data and user data concurrently
        forkJoin({
          project: this.projectService.getProject(this.id),
          projectUsers: this.userService.getProjectUsers(this.id) // Get user IDs
        }).subscribe({
          next: ({ project, projectUsers }) => {
            this.projectForm.patchValue({
              name: project.name,
              description: project.description,
              location: project.location,
            });
            this.projectUsers = projectUsers; // Store the user IDs
            this.loadUserNames(projectUsers);  // Load user names
            this.loading = false;

            // Make 'user-id' required *only* for creating new projects
            if (!this.id) {
              this.projectForm.get('user-id')?.setValidators([Validators.required]);
            }
            this.projectForm.get('user-id')?.updateValueAndValidity(); // Important!
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = error.error?.message || error.message || 'Failed to load project';
            this.loading = false;
          }
        });
      }
    });
  }

  loadUserNames(userIds: string[]) {
    if (userIds.length === 0) {
      return;
    }
    // Fetch user details for each user ID
    const userObservables = userIds.map(userId => this.userService.getUser(userId));
    forkJoin(userObservables).subscribe({ // forkJoin is efficient for multiple requests
      next: (users) => {
        users.forEach(user => {
          if (user && user.username) {  // Added null/undefined check
            this.userNames[user.userId] = user.username;
          } else {
            // Handle cases where user data is missing
            this.userNames[user.userId] = 'Unknown User'; // Or some other placeholder
          }
        });
      },
      error: (error) => {
        console.error("Error loading user names:", error);
      }
    });
  }



  sendData(data: any): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    if (!this.id) {
      const createProjectDto: CreateProjectDTO = {
        name: data.name,
        description: data.description,
        location: data.location
      };

      this.projectService.createProject(createProjectDto)
        .subscribe({
          next: (createdProject: ProjectDTO) => {
            if (data['user-id']) {
              this.projectService.addUserToProject(createdProject.projectId, data['user-id'])
                .subscribe({
                  next: () => {
                    this.router.navigate(['/dashboard']);
                  },
                  error: (userError: HttpErrorResponse) => {
                    this.errorMessage = userError.error?.message || userError.message || 'Failed to add user to project';
                    this.loading = false;
                  }
                });
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = error.error?.message || error.message || 'Failed to create project';
            this.loading = false;
          }
        });
    } else {
      const updateProjectDto: UpdateProjectDTO = {
        name: data.name,
        description: data.description,
        location: data.location
      };

      this.projectService.updateProject(this.id, updateProjectDto)
        .subscribe({
          next: (updatedProject) => {
            // Add user only if a user-id is provided
            if (data['user-id']) {
              this.projectService.addUserToProject(this.projectId!, data['user-id'])
                .subscribe({
                  next: () => {
                    this.router.navigate(['/dashboard']);
                  },
                  error: (userError: HttpErrorResponse) => {
                    this.errorMessage = userError.error?.message || userError.message || 'Failed to add user';
                    this.loading = false;
                  }
                });
            }
            else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = error.error?.message || error.message || 'Failed to update project';
            this.loading = false;
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
