import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestRun } from '../../../../core/models/test-run-entity';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-test-run',
  templateUrl: './add-test-run.component.html',
  styleUrl: './add-test-run.component.less'
})
export class AddTestRunComponent {
  projectId: string | null;
  users = ['User 1', 'User 2', 'User 3'];
  milestones = ['Milestone 1', 'Milestone 2', 'Milestone 3'];
  testRunForm: FormGroup;
  testRun: TestRun;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.testRunForm = this.fb.group({
      name: ['', Validators.required],
      assignTo: [''],
      milestones: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
    });
  }

  selectSpecificCases() {
    console.log(`/project-overview/${this.projectId}/test-cases/select-cases`);
    this.router.navigate([`/project-overview/${this.projectId}/test-cases/select-cases`]);
  }

  onSubmit() {
    console.log(this.testRunForm.value);
  }

  resetForm() {
    this.testRunForm.reset();
  }
}
