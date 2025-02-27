import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService } from '../../../../core/services/section.service'; // Шлях до сервісу
import { CreateSectionDTO, UpdateSectionDTO, SectionDTO } from '../../../../core/models/section-dto'; // Шлях до DTO
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-edit-section',
  templateUrl: './add-edit-section.component.html',
  styleUrl: './add-edit-section.component.less'
})
export class AddEditSectionComponent implements OnInit, OnDestroy {
  sectionForm: FormGroup;
  id: string | null = null; // Змінено на string | null
  projectId: string | null = null; // Додано projectId
  loading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();


  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sectionService: SectionService // Додано SectionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = params.get('id');  // Отримуємо id з URL
      // Отримуємо projectId з батьківського роуту.
      this.route.parent?.paramMap.pipe(takeUntil(this.destroy$)).subscribe(parentParams => {
        this.projectId = parentParams.get('projectId');
        if (!this.projectId) {
          console.error('Project ID is required.');
          // Можна перенаправити користувача або показати помилку
          this.router.navigate(['/error']); // Приклад перенаправлення
          return;
        }
        this.initForm(); // Ініціалізуємо форму після отримання projectId
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private initForm(): void {
    this.sectionForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    if (this.id) {
      this.loadSectionData();
    }
  }

  private loadSectionData(): void {
    this.loading = true;
    this.sectionService.getSection(this.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (section: SectionDTO) => {
          this.sectionForm.patchValue({
            name: section.name,
            description: section.description
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load section data';
          this.loading = false;
        }
      });
  }


  onSubmit(): void {
    if (this.sectionForm.invalid || !this.projectId) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const sectionData = this.sectionForm.value;

    if (!this.id) {
      this.createSection(sectionData);
    } else {
      this.updateSection(sectionData);
    }
  }


  private createSection(data: any): void {
    const createDto: CreateSectionDTO = {
      name: data.name,
      description: data.description
    };

    this.sectionService.createSection(createDto, this.projectId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route }); // Повертаємось до списку секцій
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create section';
          this.loading = false;
        }
      });
  }

  private updateSection(data: any): void {
    const updateDto: UpdateSectionDTO = {
      sectionId: this.id!, //  sectionId обов'язковий для UpdateSectionDTO
      name: data.name,
      description: data.description
    };

    this.sectionService.updateSection(this.id!, updateDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../../'], { relativeTo: this.route }); // Повертаємось до списку секцій
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update section';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route }); // Повернення до списку
  }
}
