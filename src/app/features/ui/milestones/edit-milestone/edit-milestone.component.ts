import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MilestoneService } from '../../../../core/services/milestone.service';
import { CreateMilestoneDTO, MilestoneDTO, UpdateMilestoneDTO } from '../../../../core/models/milestone-dto';
import { MilestoneStatus } from '../../../../core/models/enums/milestone-status';

@Component({
  selector: 'app-edit-milestone',
  templateUrl: './edit-milestone.component.html',
  styleUrl: './edit-milestone.component.less'
})
export class EditMilestoneComponent {
  milestoneForm: FormGroup;
  id: string | null = null; // Змінено на string | null
  projectId: string | null = null; // Додано projectId
  loading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();


  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly milestoneService: MilestoneService // Додано SectionService
  ) { }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private initForm(): void {


    this.milestoneForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: ['']
    });

    if (this.id) {
      this.loadSectionData();
    }
  }

  private loadSectionData(): void {
    this.loading = true;
    this.milestoneService.getMilestone(this.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (milestone: MilestoneDTO) => {
          this.milestoneForm.patchValue({
            name: milestone.name,
            description: milestone.description,
            startDate: milestone.startDate,
            endDate: milestone.endDate
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load milestone data';
          this.loading = false;
        }
      });
  }


  onSubmit(): void {
    if (this.milestoneForm.invalid || !this.projectId) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const milestoneData = this.milestoneForm.value;

    if (!this.id) {
      this.createMilestone(milestoneData);
    } else {
      this.updateMilestone(milestoneData);
    }
  }

  private createMilestone(data: any): void {
    const createDto: CreateMilestoneDTO = {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: MilestoneStatus.OPEN
    };

    this.milestoneService.createMilestone(createDto, this.projectId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create section';
          this.loading = false;
        }
      });
  }

  private updateMilestone(data: any): void {
    const updateDto: UpdateMilestoneDTO = {
      milestoneID: this.id!,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate
    };

    this.milestoneService.updateMilestone(this.id!, updateDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update milestone';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
