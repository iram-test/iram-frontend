import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { CreateTestCaseDTO } from '../../../../core/models/test-case-dto';
import { TemplateType } from '../../../../core/models/enums/template-type';
import { TestType } from '../../../../core/models/enums/test-type';
import { Priority } from '../../../../core/models/enums/project-priority';
import { SectionService } from '../../../../core/services/section.service';
import { SectionDTO } from '../../../../core/models/section-dto';
import { SubsectionService } from '../../../../core/services/subsection.service';
import { SubsectionDTO } from '../../../../core/models/subsection-dto';
import { Subject, forkJoin, of, Observable } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { TestCase } from '../../../../core/models/test-case-entity';
import { StepService } from '../../../../core/services/step.service';
import { CreateStepDTO } from '../../../../core/models/step-dto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {StepStatus} from "../../../../core/models/enums/step-status";

@Component({
  selector: 'app-add-test-case',
  templateUrl: './add-test-case.component.html',
  styleUrls: ['./add-test-case.component.less']
})
export class AddTestCaseComponent implements OnInit, OnDestroy {
  testCaseForm: FormGroup;
  testCase: TestCase;
  sections: SectionDTO[] = [];
  subsections: SubsectionDTO[] = [];
  selectedSectionId: string | null = null;
  templates = Object.values(TemplateType);
  types = Object.values(TestType);
  priorities = Object.values(Priority);
  automationTypes = ['Manual', 'Automated'];
  // Масиви для зображень: stepImages для Steps, expectedStepImages для Expected Results
  stepImages: (File | null)[][] = [];
  expectedStepImages: (File | null)[][] = [];
  maxImagesPerStep = 5;

  projectId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private testCaseService: TestCaseService,
    private sectionService: SectionService,
    private subsectionService: SubsectionService,
    private stepService: StepService,
    private sanitizer: DomSanitizer
  ) {
    this.testCaseForm = this.fb.group({
      title: ['', Validators.required],
      sectionId: [null],
      template: [null, Validators.required],
      type: [null, Validators.required],
      priority: [null, Validators.required],
      estimate: [''],
      references: [''],
      automationType: ['Manual'],
      preconditions: [''],
      steps: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.projectId = params.get('projectId');
      if (!this.projectId) {
        console.error('Project ID is required.');
        this.router.navigate(['/error']);
        return;
      }
      this.loadSectionsAndSubsections();
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedSectionId = params['sectionId'] || params['subsectionId'] || null;
      this.testCaseForm.patchValue({ sectionId: this.selectedSectionId });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSectionsAndSubsections() {
    if (!this.projectId) return;
    forkJoin({
      sections: this.sectionService.getSectionsByProjectId(this.projectId),
      subsections: this.loadAllSubsections()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ sections, subsections }) => {
          this.sections = sections;
          this.subsections = subsections;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load sections and subsections';
          this.loading = false;
        }
      });
  }

  private loadAllSubsections(): Observable<SubsectionDTO[]> {
    if (!this.projectId) return of([]);
    return this.sectionService.getSectionsByProjectId(this.projectId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(sections => {
          if (sections.length === 0) return of([]);
          const subsectionObservables = sections.map(section =>
            this.subsectionService.getSubsectionsBySectionId(section.sectionId)
          );
          return forkJoin(subsectionObservables).pipe(
            map(subsectionsArray => subsectionsArray.reduce((acc, curr) => acc.concat(curr), []))
          );
        }),
        catchError(error => {
          console.error("Error loading subsections:", error);
          return of([]);
        })
      );
  }

  get steps(): FormArray {
    return this.testCaseForm.get('steps') as FormArray;
  }

  addStep(): void {
    const isTemplateText = this.testCaseForm.value.template === 'Text';

    const stepGroup = this.fb.group({
      steps: [''],
      expectedResults: [''],
      image: [{ value: null, disabled: isTemplateText }],  // Disable image upload if template is 'Text'
      expectedImage: [{ value: null, disabled: isTemplateText }]  // Disable expectedImage upload if template is 'Text'
    });

    this.steps.push(stepGroup);
    // Ініціалізуємо порожні масиви для зображень для цього кроку
    this.stepImages.push([]);
    this.expectedStepImages.push([]);
  }


  moveStepUp(index: number): void {
    if (index > 0) {
      const stepsArray = this.steps;
      const currentStep = stepsArray.at(index);
      const previousStep = stepsArray.at(index - 1);
      stepsArray.removeAt(index);
      stepsArray.removeAt(index - 1);
      stepsArray.insert(index - 1, currentStep);
      stepsArray.insert(index, previousStep);
      [this.stepImages[index - 1], this.stepImages[index]] = [this.stepImages[index], this.stepImages[index - 1]];
      [this.expectedStepImages[index - 1], this.expectedStepImages[index]] = [this.expectedStepImages[index], this.expectedStepImages[index - 1]];
    }
  }

  moveStepDown(index: number): void {
    if (index < this.steps.length - 1) {
      const stepsArray = this.steps;
      const currentStep = stepsArray.at(index);
      const nextStep = stepsArray.at(index + 1);
      stepsArray.removeAt(index + 1);
      stepsArray.removeAt(index);
      stepsArray.insert(index, nextStep);
      stepsArray.insert(index + 1, currentStep);
      [this.stepImages[index], this.stepImages[index + 1]] = [this.stepImages[index + 1], this.stepImages[index]];
      [this.expectedStepImages[index], this.expectedStepImages[index + 1]] = [this.expectedStepImages[index + 1], this.expectedStepImages[index]];
    }
  }

  removeStep(index: number): void {
    this.steps.removeAt(index);
    this.stepImages.splice(index, 1);
    this.expectedStepImages.splice(index, 1);
  }

  onImageSelected(event: any, stepIndex: number, isStepImage: boolean): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isStepImage) {
        if (this.stepImages[stepIndex].length < this.maxImagesPerStep) {
          this.stepImages[stepIndex].push(file);
        } else {
          alert(`Максимум ${this.maxImagesPerStep} зображень дозволено для цього кроку.`);
        }
      } else {
        if (this.expectedStepImages[stepIndex].length < this.maxImagesPerStep) {
          this.expectedStepImages[stepIndex].push(file);
        } else {
          alert(`Максимум ${this.maxImagesPerStep} зображень дозволено для цього кроку.`);
        }
      }
    }
  }

  removeImage(stepIndex: number, imageIndex: number, isStepImage: boolean): void {
    if (isStepImage) {
      this.stepImages[stepIndex].splice(imageIndex, 1);
    } else {
      this.expectedStepImages[stepIndex].splice(imageIndex, 1);
    }
  }

  getObjectURL(file: File | null): SafeUrl | null {
    if (file) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.testCaseForm.invalid || !this.projectId) {
      return;
    }
    this.loading = true;
    this.errorMessage = null;

    try {
      const testCaseData: CreateTestCaseDTO = {
        title: this.testCaseForm.value.title,
        sectionId: this.testCaseForm.value.sectionId,
        templateType: this.testCaseForm.value.template,
        testType: this.testCaseForm.value.type,
        priority: this.testCaseForm.value.priority,
        timeEstimation: this.testCaseForm.value.estimate,
        description: this.testCaseForm.value.preconditions,
        stepIds: []
      };

      const createdTestCase = await this.testCaseService.createTestCase(testCaseData, this.projectId).toPromise();
      if (!createdTestCase || !createdTestCase.testCaseId) {
        throw new Error('Failed to create test case or test case ID is missing.');
      }

      const stepCreationObservables: Observable<any>[] = [];
      for (let i = 0; i < this.steps.length; i++) {
        const stepValue = this.steps.at(i).value;
        const stepData: CreateStepDTO = {
          stepDescription: stepValue.steps,
          expectedResult: stepValue.expectedResults,
          stepStatus: StepStatus.UNTESTED,
          image: [],
          testCaseId: createdTestCase.testCaseId
        };

        const createStepObservable = this.stepService.createStep(stepData, createdTestCase.testCaseId);
        stepCreationObservables.push(
          createStepObservable.pipe(
            switchMap((createdStep) => {
              const imageUploadObservables: Observable<any>[] = [];
              // Завантаження звичайних зображень для Steps
              if (this.stepImages[i]) {
                for (const image of this.stepImages[i]) {
                  if (image) {
                    imageUploadObservables.push(
                      this.stepService.uploadImage(this.projectId!, createdStep.stepId, image)
                    );
                  }
                }
              }
              // Завантаження expected images для Expected Results
              if (this.expectedStepImages[i]) {
                for (const image of this.expectedStepImages[i]) {
                  if (image) {
                    imageUploadObservables.push(
                      this.stepService.uploadExpectedImage(this.projectId!, createdStep.stepId, image)
                    );
                  }
                }
              }
              return imageUploadObservables.length > 0 ? forkJoin(imageUploadObservables) : of(createdStep);
            })
          )
        );
      }

      await forkJoin(stepCreationObservables).toPromise();
      this.loading = false;
      this.router.navigate(['../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to create test case and steps';
      this.loading = false;
      console.error("An error occurred:", error);
    }
  }

  resetForm(): void {
    this.testCaseForm.reset();
    while (this.steps.length) {
      this.steps.removeAt(0);
    }
    this.stepImages = [];
    this.expectedStepImages = [];
    this.testCaseForm.patchValue({ automationType: 'Manual' });
  }
}
