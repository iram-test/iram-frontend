import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestRun } from '../../../../core/models/test-run-entity';
import { TestRunService } from '../../../../core/services/test-run.service';
import { Subject, takeUntil } from 'rxjs';
import { TestRunDTO } from '../../../../core/models/test-run-dto';

@Component({
  selector: 'app-add-edit-test-run',
  templateUrl: './add-edit-test-run.component.html',
  styleUrl: './add-edit-test-run.component.less'
})
export class AddEditTestRunComponent {
  loading: boolean = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();
  id: string | null;
  projectId: string | null;
  users = ['User 1', 'User 2', 'User 3'];
  milestones = ['Milestone 1', 'Milestone 2', 'Milestone 3'];
  testRunForm: FormGroup;
  testRun: TestRun;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private testRunService: TestRunService) {
    this.testRunForm = this.fb.group({
      name: ['', Validators.required],
      assignTo: [''],
      milestones: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = params.get('id');
      this.route.parent?.paramMap.pipe(takeUntil(this.destroy$)).subscribe(parentParams => {
        this.projectId = parentParams.get('projectId');
        if (!this.projectId) {
          console.error('Project ID is required.');
          this.router.navigate(['/error']);
          return;
        }
        this.initForm();
      });
    });
  }

  private initForm(): void {
    this.testRunForm = this.fb.group({
      name: ['', Validators.required],
      assignTo: [''],
      milestones: [''],
      description: ['']
    });

    if (this.id) {
      this.loadTestRunData();
    }
  }

  private loadTestRunData(): void {
    this.loading = true;
    this.testRunService.getTestRun(this.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (testRun: TestRunDTO) => {
          this.testRunForm.patchValue({
            name: testRun.name,
            assignTo: testRun.assignedUserIds,
            milestones: testRun.milestoneIds,
            description: testRun.description
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load test run data';
          this.loading = false;
        }
      });
  }

  selectSpecificCases() {
    this.router.navigate([`/project-overview/${this.projectId}/test-cases/select-cases`]);
  }

  onSubmit() {
    console.log(this.testRunForm.value);
  }

  resetForm() {
    this.testRunForm.reset();
  }
}
