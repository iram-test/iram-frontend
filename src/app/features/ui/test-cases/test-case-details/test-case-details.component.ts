// src/app/modules/admin/components/test-case-details/test-case-details.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StepDTO } from '../../../../core/models/step-dto';
import { ActivatedRoute } from '@angular/router';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { TestCaseDTO } from '../../../../core/models/test-case-dto';
import { StepService } from '../../../../core/services/step.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-test-case-details',
  templateUrl: './test-case-details.component.html',
  styleUrls: ['./test-case-details.component.less']
})
export class TestCaseDetailsComponent implements OnInit {
  steps: StepDTO[] = [];
  testCase: TestCaseDTO | null = null;
  //initialsBackgroundColor: string = ''; // Більше не генеруємо тут колір
  selectedStep: StepDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private testCaseService: TestCaseService,
    private stepService: StepService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const testCaseId = params.get('testCaseId');
      if (testCaseId) {
        this.loadTestCaseDetails(testCaseId);
      } else {
        console.error('Test Case ID is missing!');
      }
    });
  }

  loadTestCaseDetails(testCaseId: string) {
    this.testCaseService.getTestCase(testCaseId).subscribe({
      next: (testCase: TestCaseDTO) => {
        this.testCase = testCase;
        //this.initialsBackgroundColor = this.getRandomColor(); // Більше не генеруємо тут

        if (testCase.stepIds && testCase.stepIds.length > 0) {
          const stepObservables = testCase.stepIds.map(stepId => this.stepService.getStep(stepId));
          forkJoin(stepObservables).subscribe({
            next: (steps: StepDTO[]) => {
              this.steps = steps;
            },
            error: (error) => {
              console.error('Error loading steps:', error);
            }
          });
        } else {
          this.steps = [];
        }
      },
      error: (error) => {
        console.error('Error loading test case details:', error);
      }
    });
  }

  openPopup(step: StepDTO, imageUrls: string[], expectedImageUrls: string[]) {
    this.selectedStep = step;
    // Передаємо expectedImageUrls разом із звичайними зображеннями
    this.selectedStep['expectedImageUrls'] = expectedImageUrls;
  }

  closePopup() {
    this.selectedStep = null;
  }

  onImageDeleted(index: number) {
    console.log(`Image deleted for step at index ${index}`);
  }

  onImageUploaded(event: { index: number; imageUrl: string }) {
    console.log(`Image uploaded for step at index ${event.index}, URL: ${event.imageUrl}`);
  }

  onStepUpdated(updatedStep: StepDTO) {
    const index = this.steps.findIndex(step => step.stepId === updatedStep.stepId);
    if (index !== -1) {
      this.steps[index] = updatedStep;
    }
  }

  /*getRandomColor(): string { // Більше не потрібна ця функція тут
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }*/
}
