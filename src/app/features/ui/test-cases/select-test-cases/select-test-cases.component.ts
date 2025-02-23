import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TemplateType } from '../../../../core/models/enums/template-type';
import { TestType } from '../../../../core/models/enums/test-type';
import { Priority } from '../../../../core/models/enums/project-priority';
import { Status } from '../../../../core/models/enums/status';
import { FormsModule } from '@angular/forms';
import { TestCase } from '../../../../core/models/test-case-entity';

interface CaseSection {
  sectionId: string;
  name: string;
  testCases: TestCase[];
}

@Component({
  selector: 'app-select-test-cases',
  templateUrl: './select-test-cases.component.html',
  styleUrls: ['./select-test-cases.component.less']
})
export class SelectTestCasesComponent implements OnInit {

  // Inject FormBuilder
  private fb = inject(FormBuilder);

  // Signals for state management
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  caseSections = signal<CaseSection[]>([
    {
      sectionId: 'section-1',
      name: 'Section 1 - Smoke Tests',
      testCases: []
    },
    {
      sectionId: 'section-2',
      name: 'Section 2 - Regression Tests',
      testCases: [
        new TestCase(
          'tc-1',
          'Title Check',
          'section-2',
          'project-1',
          null,
          TemplateType.STEPS,
          TestType.ACCEPTANCE,
          Priority.HIGH,
          Status.UNTESTED,
          '10m',
          'Description for Title Check',
          null,
          new Date().toISOString(),
          new Date().toISOString()
        ),
        new TestCase(
          'tc-2',
          'Filter Titles Check',
          'section-2',
          'project-1',
          null,
          TemplateType.STEPS,
          TestType.ACCEPTANCE,
          Priority.HIGH,
          Status.UNTESTED,
          '10m',
          'Description for Filter Titles Check',
          null,
          new Date().toISOString(),
          new Date().toISOString()
        ),
      ]
    },
    {
      sectionId: 'section-3',
      name: 'Section 3 - Other Tests',
      testCases: []
    }
  ]);

  testCaseForm: FormGroup = this.fb.group({
    sections: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadTestCaseSections();
  }

  loadTestCaseSections(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.initializeForm();
      this.isLoading.set(false);
    }, 500);
  }

  private initializeForm(): void {
    this.caseSections().forEach(section => {
      const sectionGroup = this.fb.group({
        sectionId: section.sectionId,
        name: section.name,
        expanded: new FormControl(section.testCases.length > 0),
        testCases: this.fb.array([])
      });

      section.testCases.forEach(testCase => {
        const testCaseControl = new FormControl(false);
        (sectionGroup.get('testCases') as FormArray).push(testCaseControl);
      });

      (this.testCaseForm.get('sections') as FormArray).push(sectionGroup);

      if (section.sectionId === 'section-1') {
        this.populateSectionWithDummyTestCases(section.sectionId, 4);
      }
    });
  }

  populateSectionWithDummyTestCases(sectionId: string, count: number): void {
    const testCases: TestCase[] = [];
    for (let i = 1; i <= count; i++) {
      testCases.push(
        new TestCase(
          `dummy-tc-${sectionId}-${i}`,
          `Dummy Test Case ${i} in ${sectionId}`,
          sectionId,
          'project-1',
          null,
          TemplateType.TEXT,
          TestType.INTEGRATION,
          Priority.MEDIUM,
          Status.UNTESTED,
          '5m',
          `Description for Dummy Test Case ${i}`,
          null,
          new Date().toISOString(),
          new Date().toISOString()
        )
      );
    }

    const section = this.caseSections().find(s => s.sectionId === sectionId);
    if (section) {
      section.testCases = testCases;
      const sectionGroup = this.getSectionFormGroup(sectionId);
      const testCaseFormArray = sectionGroup.get('testCases') as FormArray;

      testCases.forEach(() => {
        testCaseFormArray.push(new FormControl(false));
      });
    }
  }

  get sectionFormArray(): FormArray {
    return this.testCaseForm.get('sections') as FormArray;
  }

  getSectionFormGroup(sectionId: string): FormGroup {
    const sectionFormArray = this.testCaseForm.get('sections') as FormArray;
    return sectionFormArray.controls.find((control: any) => control.get('sectionId').value === sectionId) as FormGroup;
  }

  getTestCaseFormArray(sectionId: string): FormArray<FormControl> {
    const sectionFormGroup = this.getSectionFormGroup(sectionId);
    return sectionFormGroup.get('testCases') as FormArray<FormControl>;
  }

  toggleSection(sectionId: string): void {
    const sectionFormGroup = this.getSectionFormGroup(sectionId);
    const expandedControl = sectionFormGroup.get('expanded');
    expandedControl?.setValue(!expandedControl.value);
  }

  toggleAllSectionCases(sectionId: string): void {
    const testCaseFormArray = this.getTestCaseFormArray(sectionId);
    const allChecked = testCaseFormArray.controls.every((control: FormControl) => control.value);

    testCaseFormArray.controls.forEach((control: FormControl) => {
      control.setValue(!allChecked);
    });
  }

  setAllSectionCases(sectionId: string, checked: boolean): void {
    const testCaseFormArray = this.getTestCaseFormArray(sectionId);
    testCaseFormArray.controls.forEach((control: FormControl) => {
      control.setValue(checked);
    });
  }

  onSubmit(): void {
    const selectedTestCases: { sectionId: string; testCaseIds: string[] }[] = [];

    this.sectionFormArray.controls.forEach((sectionGroup: any) => {
      const sectionId = sectionGroup.get('sectionId').value;
      const testCaseFormArray = sectionGroup.get('testCases') as FormArray;
      const selectedTestCaseIds: string[] = [];

      testCaseFormArray.controls.forEach((control: FormControl, index: number) => {
        if (control.value) {
          selectedTestCaseIds.push(this.caseSections().find(sec => sec.sectionId === sectionId)?.testCases[index].testCaseId || '');
        }
      });

      if (selectedTestCaseIds.length > 0) {
        selectedTestCases.push({ sectionId, testCaseIds: selectedTestCaseIds });
      }
    });

    console.log('Selected Test Cases:', selectedTestCases);
  }

  onCancel(): void {
    console.log("Cancel Clicked. Resetting the form.");

    this.caseSections().forEach(section => {
      const sectionGroup = this.getSectionFormGroup(section.sectionId);
      const testCaseFormArray = sectionGroup.get('testCases') as FormArray;

      testCaseFormArray.controls.forEach((control: FormControl) => {
        control.setValue(false);
      });
    });

    this.caseSections().forEach(section => {
      const sectionGroup = this.getSectionFormGroup(section.sectionId);
      sectionGroup.get('expanded')?.setValue(false);
    });
  }

  isEveryTestCaseSelected(sectionId: string): boolean {
    const formArray = this.getTestCaseFormArray(sectionId);
    return formArray.controls.every(control => control.value);
  }

}