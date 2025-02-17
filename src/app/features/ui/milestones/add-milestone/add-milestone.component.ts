import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Milestone } from '../../../../core/models/milestone-entity';

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrl: './add-milestone.component.less'
})
export class AddMilestoneComponent {
  milestoneForm: FormGroup;
  milestone: Milestone;

  constructor(private fb: FormBuilder) {
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
  }
}
