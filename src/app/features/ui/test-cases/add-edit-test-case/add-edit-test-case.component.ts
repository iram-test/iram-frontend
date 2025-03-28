import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestCase } from '../../../../core/models/test-case-entity';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { CreateTestCaseDTO, TestCaseDTO, UpdateTestCaseDTO } from '../../../../core/models/test-case-dto';
import { TemplateType } from '../../../../core/models/enums/template-type';
import { TestType } from '../../../../core/models/enums/test-type';
import { Priority } from '../../../../core/models/enums/project-priority';
import { SectionService } from '../../../../core/services/section.service';
import { SectionDTO } from '../../../../core/models/section-dto';
import { SubsectionService } from '../../../../core/services/subsection.service';
import { SubsectionDTO } from '../../../../core/models/subsection-dto';
import { Subject, takeUntil, forkJoin, of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { StepService } from '../../../../core/services/step.service';
import { StepDTO, CreateStepDTO, UpdateStepDTO } from '../../../../core/models/step-dto'; // Ensure CreateStepDTO is imported
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {StepStatus} from "../../../../core/models/enums/step-status";

interface ImageUpload {
  file: File | null;
  url: string | null;
}

@Component({
  selector: 'app-add-edit-test-case',
  templateUrl: './add-edit-test-case.component.html',
  styleUrl: './add-edit-test-case.component.less'
})
export class AddEditTestCaseComponent implements OnInit, OnDestroy {
  testCaseForm: FormGroup;
  testCase: TestCase;
  id: string | null = null;
  sections: SectionDTO[] = [];
  subsections: SubsectionDTO[] = [];
  selectedSectionId: string | null = null;
  templates = Object.values(TemplateType);
  types = Object.values(TestType);
  priorities = Object.values(Priority);
  automationTypes = ['Manual', 'Automated'];
  stepImages: ImageUpload[][] = [];
  expectedStepImages: ImageUpload[][] = [];
  maxImagesPerStep = 5;

  projectId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;  // Add this line
  private destroy$ = new Subject<void>();

  // Додайте масив для збереження оригінальних stepId
  originalSteps: StepDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private testCaseService: TestCaseService,
    private stepService: StepService,
    private sectionService: SectionService,
    private subsectionService: SubsectionService,
    private sanitizer: DomSanitizer
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.projectId = params.get('projectId');
      this.id = params.get('id');
      if (!this.projectId) {
        console.error('Project ID is required.');
        this.router.navigate(['/error']);
        return;
      }
      this.initForm();
      this.loadSectionsAndSubsections();
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedSectionId = params['sectionId'] || params['subsectionId'] || null;
      this.testCaseForm.patchValue({ sectionId: this.selectedSectionId });
    });

    // Subscribe to template changes
    this.testCaseForm.get('template')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(template => {
      if (template === 'Text') {
        this.clearStepImages();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
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

    if (this.id) {
      this.loadTestCaseData();
    }
  }

  loadTestCaseData() {
    this.loading = true;
    this.testCaseService.getTestCase(this.id!)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((testCase: TestCaseDTO) => {
          this.testCaseForm.patchValue({
            title: testCase.title,
            sectionId: testCase.sectionId,
            template: testCase.templateType,
            type: testCase.testType,
            priority: testCase.priority,
            preconditions: testCase.description,
            estimate: testCase.timeEstimation,
            automationType: testCase.testType
          });

          // Load steps after patching the form
          return this.loadSteps(testCase.testCaseId);
        }),
        catchError(error => {
          this.errorMessage = error.message || 'Failed to load test case data';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  loadSteps(testCaseId: string): Observable<void> {
    return this.stepService.getStepsByTestCaseId(testCaseId).pipe(
      takeUntil(this.destroy$),
      tap(steps => {
        // Clear existing steps
        while (this.steps.length !== 0) {
          this.steps.removeAt(0);
          this.stepImages.pop();
          this.expectedStepImages.pop();
        }

        // Add steps from the database to the form
        steps.forEach(step => {
          const stepGroup = this.fb.group({
            stepId: [step.stepId], // Збережіть stepId у формі
            steps: [step.stepDescription],
            expectedResults: [step.expectedResult],
          });
          this.steps.push(stepGroup);

          // Initialize image arrays with existing URLs or null if no image
          this.stepImages.push(step.image ? step.image.map(url => ({ file: null, url: url })) : []);
          this.expectedStepImages.push(step.expectedImage ? step.expectedImage.map(url => ({ file: null, url: url })) : []);
        });

        // Збережіть оригінальні кроки
        this.originalSteps = steps;
      })
    ).pipe(map(() => { }))
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
    if (!this.projectId) {
      return of([]);
    }

    return this.sectionService.getSectionsByProjectId(this.projectId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(sections => {
          if (sections.length === 0) {
            return of([]);
          }
          const subsectionObservables = sections.map(section =>
            this.subsectionService.getSubsectionsBySectionId(section.sectionId)
          );
          return forkJoin(subsectionObservables).pipe(
            map(subsectionsArray => {
              return subsectionsArray.reduce((acc, curr) => acc.concat(curr), []);
            })
          );
        }),
        catchError(error => {
          console.error("Error loading subsections:", error);
          return of([]);
        })
      );
  }

  get steps() {
    return this.testCaseForm.get('steps') as FormArray;
  }

  addStep() {
    const stepGroup = this.fb.group({
      stepId: [null], // Новий крок не має stepId
      steps: [''],
      expectedResults: ['']
    });
    this.steps.push(stepGroup);
    this.stepImages.push([]);
    this.expectedStepImages.push([]);
  }

  moveStepUp(index: number) {
    if (index > 0) {
      const stepsArray = this.steps as FormArray;
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

  moveStepDown(index: number) {
    if (index < this.steps.length - 1) {
      const stepsArray = this.steps as FormArray;
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

  removeStep(index: number) {
    this.steps.removeAt(index);
    this.stepImages.splice(index, 1);
    this.expectedStepImages.splice(index, 1);
  }

  onImageSelected(event: any, stepIndex: number, isStepImage: boolean): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageUrl = e.target.result as string; // This is the URL
        if (isStepImage) {
          if (this.stepImages[stepIndex].length < this.maxImagesPerStep) {
            this.stepImages[stepIndex].push({ file: file, url: imageUrl });
          } else {
            alert(`Максимум ${this.maxImagesPerStep} зображень дозволено для цього кроку.`);
          }
        } else {
          if (this.expectedStepImages[stepIndex].length < this.maxImagesPerStep) {
            this.expectedStepImages[stepIndex].push({ file: file, url: imageUrl });
          } else {
            alert(`Максимум ${this.maxImagesPerStep} зображень дозволено для цього кроку.`);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(stepIndex: number, imageIndex: number, isStepImage: boolean): void {
    const imageUrl = isStepImage ? this.stepImages[stepIndex][imageIndex].url : this.expectedStepImages[stepIndex][imageIndex].url;

    if (!imageUrl) {
      console.error('Image URL is missing. Cannot delete.');
      return;
    }

    const stepId = this.steps.at(stepIndex).get('stepId')?.value;

    if (!stepId) {
      console.error('Step ID is missing. Cannot delete image.');
      return;
    }

    let deleteObservable: Observable<void>;
    if (isStepImage) {
      deleteObservable = this.stepService.deleteImage(stepId, imageUrl);
    } else {
      deleteObservable = this.stepService.deleteExpectedImage(stepId, imageUrl);
    }

    deleteObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        if (isStepImage) {
          this.stepImages[stepIndex].splice(imageIndex, 1);
        } else {
          this.expectedStepImages[stepIndex].splice(imageIndex, 1);
        }
        console.log('Image deleted successfully.');
      },
      error: (error) => {
        console.error('Error deleting image:', error);
      }
    });
  }

  getObjectURL(item: ImageUpload | null): SafeUrl | null {
    if (item?.url) {
      return this.sanitizer.bypassSecurityTrustUrl(item.url);
    }
    return null;
  }

  // New method to clear images when template changes to 'Text'
  clearStepImages(): void {
    this.stepImages = this.stepImages.map(() => []);
    this.expectedStepImages = this.expectedStepImages.map(() => []);
  }

  onSubmit() {
    if (this.testCaseForm.invalid || !this.projectId) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

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

    const updateTestCaseData: UpdateTestCaseDTO = {
      testCaseId: this.id!, // Додано testCaseId
      title: this.testCaseForm.value.title,
      sectionId: this.testCaseForm.value.sectionId,
      templateType: this.testCaseForm.value.template,
      testType: this.testCaseForm.value.type,
      priority: this.testCaseForm.value.priority,
      timeEstimation: this.testCaseForm.value.estimate,
      description: this.testCaseForm.value.preconditions,
    };

    const testCaseObservable = this.id
      ? this.testCaseService.updateTestCase(this.id, updateTestCaseData)
      : this.testCaseService.createTestCase(testCaseData, this.projectId);

    testCaseObservable.pipe(
      takeUntil(this.destroy$),
      switchMap((testCase: TestCaseDTO) => {
        if (!testCase || !testCase.testCaseId) {
          throw new Error('Failed to create/update test case or test case ID is missing.');
        }

        // Логіка оновлення/створення/видалення кроків
        const stepObservables: Observable<any>[] = [];

        // 1. Оновлення або створення кроків
        for (let i = 0; i < this.steps.length; i++) {
          const stepValue = this.steps.at(i).value;
          const stepId = stepValue.stepId ? stepValue.stepId : uuidv4(); //Генерируем новый UUID, если stepId не существует

          if (stepValue.stepId) {
            // Крок існує, оновлюємо його
            const updateStepData: UpdateStepDTO = {
              stepId: stepValue.stepId,
              stepDescription: stepValue.steps,
              expectedResult: stepValue.expectedResults,
            };
            stepObservables.push(this.stepService.updateStep(stepValue.stepId, updateStepData));
          } else {
            // Крок новий, створюємо його
            const createStepData: CreateStepDTO = {
              stepDescription: stepValue.steps,
              expectedResult: stepValue.expectedResults,
              stepStatus: StepStatus.UNTESTED,
              testCaseId: testCase.testCaseId
            };
            stepObservables.push(this.stepService.createStep(createStepData, testCase.testCaseId));
          }

          //Upload Images
          const imageUploadObservables: Observable<any>[] = [];

          for (let j = 0; j < this.stepImages[i].length; j++) {
            const imageUpload = this.stepImages[i][j];
            if (imageUpload && imageUpload.file) {
              imageUploadObservables.push(
                this.stepService.uploadImage(this.projectId!, stepId, imageUpload.file)
              );
            }
          }

          for (let j = 0; j < this.expectedStepImages[i].length; j++) {
            const imageUpload = this.expectedStepImages[i][j];
            if (imageUpload && imageUpload.file) {
              imageUploadObservables.push(
                this.stepService.uploadExpectedImage(this.projectId!, stepId, imageUpload.file)
              );
            }
          }
          stepObservables.push(...imageUploadObservables);
        }

        // 2. Видалення кроків
        // Тут потрібно порівняти originalSteps з поточними steps, щоб знайти видалені
        const currentStepIds = this.steps.controls.map(control => control.get('stepId')?.value).filter(id => id !== null);

        this.originalSteps.forEach(originalStep => {
          if (!currentStepIds.includes(originalStep.stepId)) {
            // Крок був видалений
            stepObservables.push(this.stepService.deleteStep(originalStep.stepId));
          }
        });

        return forkJoin(stepObservables);
      }),
      catchError((error) => {
        this.errorMessage = error.message || 'Failed to create test case and steps';
        this.loading = false;
        console.error("An error occurred:", error);
        return of(null);
      })
    )
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'The test case updated successfully';
          //this.router.navigate(['../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
          //this.router.navigate(['./'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to update test case. See console for details.';
          this.loading = false;
        }
      });
  }


  resetForm() {
    this.testCaseForm.reset();
    while (this.steps.length) {
      this.steps.removeAt(0);
    }
    this.stepImages = [];
    this.expectedStepImages = [];
    this.testCaseForm.patchValue({ automationType: 'Manual' });
  }
}
