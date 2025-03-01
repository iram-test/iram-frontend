import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-test-result',
  templateUrl: './add-edit-test-result.component.html',
  styleUrls: ['./add-edit-test-result.component.less']
})
export class AddEditTestResultComponent {
  testResultForm: FormGroup;

  steps: any[] = [{
    description: 'Click on the category "Products for gamers"',
    image1: 'path/to/image1.png',
    image2: 'path/to/image2.png',
    status: 'untested'
  }];

  addStep() {
    this.steps.push({
      description: '',
      image1: '',
      image2: '',
      status: 'untested'
    });
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.testResultForm = this.fb.group({
      status: ['untested', Validators.required],
      comment: [''],
      steps: this.fb.group({
        steps: [''],
        expectedResults: ['']
      }),
      assignTo: [''],
      elapsed: ['']
    });
  }

  getHeaderColor(): string {
    switch (this.testResultForm.get('status').value) {
      case 'passed':
        return '#2E7D38';
      case 'failed':
        return '#AF093E';
      case 'blocked':
        return '#4B4B4B';
      case 'retest':
        return '#AF970B';
      default:
        return '#7A7A78';
    }
  }

  onSubmit(): void {
    console.log(this.testResultForm.value);
  }
}