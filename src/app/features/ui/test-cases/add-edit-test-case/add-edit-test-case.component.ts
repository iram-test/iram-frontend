import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestCase } from '../../../../core/models/test-case-entity';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { CreateTestCaseDTO, TestCaseDTO } from '../../../../core/models/test-case-dto';
import { TemplateType } from '../../../../core/models/enums/template-type';
import { TestType } from '../../../../core/models/enums/test-type';
import { Priority } from '../../../../core/models/enums/project-priority';
import { SectionService } from '../../../../core/services/section.service';
import { SectionDTO } from '../../../../core/models/section-dto';
import { SubsectionService } from '../../../../core/services/subsection.service';
import { SubsectionDTO } from '../../../../core/models/subsection-dto';
import { Subject, takeUntil, forkJoin, of, Observable } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { StepService } from '../../../../core/services/step.service';
import { StepDTO } from '../../../../core/models/step-dto';


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
  stepImages: string[] = [];

  projectId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private testCaseService: TestCaseService,
    private stepService: StepService,
    private sectionService: SectionService,
    private subsectionService: SubsectionService
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (testCase: TestCaseDTO) => {
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
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load milestone data';
          this.loading = false;
        }
      });
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
      steps: [''],
      expectedResults: ['']
    });
    this.steps.push(stepGroup);
    this.stepImages.push('');
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

      const currentImage = this.stepImages[index];
      this.stepImages[index] = this.stepImages[index - 1];
      this.stepImages[index - 1] = currentImage;
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

      const currentImage = this.stepImages[index];
      this.stepImages[index] = this.stepImages[index + 1];
      this.stepImages[index + 1] = currentImage;
    }
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
    this.stepImages.splice(index, 1);
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
              this.stepImages[index] = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  }

  onSubmit() {
    if (this.testCaseForm.invalid || !this.projectId) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const testCaseData: CreateTestCaseDTO = {
      title: this.testCaseForm.value.title,
      sectionId: this.testCaseForm.value.sectionId,
      templateType: this.testCaseForm.value.template,
      testType: this.testCaseForm.value.type,
      priority: this.testCaseForm.value.priority,
      timeEstimation: this.testCaseForm.value.estimate,
      description: this.testCaseForm.value.preconditions,
      stepIds: this.steps.value.map((_: any) => uuidv4())
    };

    this.testCaseService.createTestCase(testCaseData, this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create test case';
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
    this.testCaseForm.patchValue({ automationType: 'Manual' });
  }
}
