import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestRun } from '../../../../core/models/test-run-entity';

@Component({
  selector: 'app-add-test-run',
  templateUrl: './add-test-run.component.html',
  styleUrl: './add-test-run.component.less'
})
export class AddTestRunComponent {
  users = ['User 1', 'User 2', 'User 3'];
  milestones = ['Milestone 1', 'Milestone 2', 'Milestone 3'];
  testRunForm: FormGroup;
  testRun: TestRun;

  constructor(private fb: FormBuilder) {
    this.testRunForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startdate: [''],
      enddate: ['']
    });
  }

  onSubmit() {
    console.log(this.testRunForm.value);
  }

  resetForm() {
    this.testRunForm.reset();
  }
}
