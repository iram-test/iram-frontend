import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubsectionService } from '../../../../core/services/subsection.service';
import { CreateSubsectionDTO, SubsectionDTO, UpdateSubsectionDTO } from '../../../../core/models/subsection-dto';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-edit-subsection',
  templateUrl: './add-edit-subsection.component.html',
  styleUrl: './add-edit-subsection.component.less'
})
export class AddEditSubsectionComponent implements OnInit, OnDestroy {
  subSectionForm: FormGroup;
  id: string | null = null;
  sectionId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly subsectionService: SubsectionService
  ) {
    this.subSectionForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = params.get('id');
    });

    // Отримуємо sectionId з queryParams
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.sectionId = params['sectionId'];

      if (!this.sectionId && !this.id) {
        console.error('Section ID is required.');
        this.router.navigate(['/error']);
        return;
      }

      if (this.id) {
        this.loadSubsectionData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSubsectionData(): void {
    this.loading = true;
    this.subsectionService.getSubsection(this.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subsection: SubsectionDTO) => {
          this.subSectionForm.patchValue({
            name: subsection.name,
            description: subsection.description
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load subsection data';
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.subSectionForm.invalid || !this.sectionId) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    const subsectionData = this.subSectionForm.value;

    if (!this.id) {
      this.createSubsection(subsectionData);
    } else {
      this.updateSubsection(subsectionData);
    }
  }

  private createSubsection(data: any): void {
    const createDto: CreateSubsectionDTO = {
      name: data.name,
      description: data.description,
      sectionId: this.sectionId!
    };

    this.subsectionService.createSubsection(createDto, this.sectionId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create subsection';
          this.loading = false;
        }
      });
  }

  private updateSubsection(data: any): void {
    const updateDto: UpdateSubsectionDTO = {
      subsectionId: this.id!,
      name: data.name,
      description: data.description
    };

    this.subsectionService.updateSubsection(this.id!, updateDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });

        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update subsection';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }
}
