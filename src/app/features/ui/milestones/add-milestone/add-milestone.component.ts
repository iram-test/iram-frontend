import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Milestone } from '../../../../core/models/milestone-entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrl: './add-milestone.component.less'
})
export class AddMilestoneComponent {
  milestoneForm: FormGroup;
  milestone: Milestone;

  constructor(private fb: FormBuilder, private router: Router) {
    this.milestoneForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startdate: [''],
      enddate: ['']
    });
  }

  onSubmit() {
    console.log(this.milestoneForm.value);
  }

  resetForm() {
    this.milestoneForm.reset();
    this.router.navigate(['/milestones'])
  }
}
