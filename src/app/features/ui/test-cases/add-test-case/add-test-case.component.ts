import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TestCaseDTO } from '../../../../core/Models/test-case-dto';

@Component({
  selector: 'app-add-test-case',
  templateUrl: './add-test-case.component.html',
  styleUrl: './add-test-case.component.less'
})
export class AddTestCaseComponent {
  testCaseForm: FormGroup;
  testCase: TestCaseDTO;
  sections = ['Section 1', 'Section 2', 'Section 3'];
  templates = ['Template 1', 'Template 2', 'Template 3'];
  types = ['Type 1', 'Type 2', 'Type 3'];
  priorities = ['High', 'Medium', 'Low'];
  automationTypes = ['Manual', 'Automated'];
  stepImages: string[] = [];

  constructor(private fb: FormBuilder) {
    this.testCaseForm = this.fb.group({
      title: [''],
      section: [''],
      template: [''],
      type: [''],
      priority: [''],
      estimate: [''],
      references: [''],
      automationType: [''],
      preconditions: [''],
      steps: this.fb.array([])
    });
  }

  get steps() {
    return this.testCaseForm.get('steps') as FormArray;
  }

  addStep() {
    const stepGroup = this.fb.group({
      steps: [''],
      expectedResults: ['']
    });
    this.steps.push(stepGroup);
    this.stepImages.push(''); // Add an empty string to stepImages to track each step's image
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
    this.stepImages.splice(index, 1); // Remove the corresponding image entry
  }

  onPaste(event: ClipboardEvent, index: number) {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.stepImages[index] = e.target.result; // Store the image URL
            };
            reader.readAsDataURL(file); // Read the image as a data URL
          }
        }
      }
    }
  }

  onSubmit() {
    console.log(this.testCaseForm.value);
    console.log(this.stepImages); // Log images as well
  }

  resetForm() {
    this.testCaseForm.reset();
    while (this.steps.length) {
      this.steps.removeAt(0);
    }
    this.stepImages = [];
  }
}
