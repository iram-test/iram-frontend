import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MilestoneService } from '../../../../core/services/milestone.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MilestoneStatus } from '../../../../core/models/enums/milestone-status';
import { CreateMilestoneDTO } from "../../../../core/models/milestone-dto";

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrl: './add-milestone.component.less'
})
export class AddMilestoneComponent implements OnInit {
  milestoneForm: FormGroup;
  id: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private milestoneService: MilestoneService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.milestoneForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      if (!this.projectId) {
        console.error('Project ID is missing!');
      }
    });
  }

  onSubmit() {
    if (this.milestoneForm.invalid || !this.projectId) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const milestoneDto: CreateMilestoneDTO = {
      name: this.milestoneForm.value.name,
      description: this.milestoneForm.value.description,
      startDate: this.milestoneForm.value.startDate ? this.milestoneForm.value.startDate : null,
      endDate: this.milestoneForm.value.endDate ? this.milestoneForm.value.endDate : null,
      status: MilestoneStatus.OPEN,
    };

    this.milestoneService.createMilestone(milestoneDto, this.projectId)
      .subscribe({
        next: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create milestone';
          this.loading = false;
        }
      });
  }

  resetForm() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
