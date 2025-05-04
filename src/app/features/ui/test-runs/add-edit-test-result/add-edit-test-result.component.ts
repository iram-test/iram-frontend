import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../../../core/services/user.service';
import { UserDTO } from '../../../../core/models/user-dto';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { StepService } from '../../../../core/services/step.service';
import { StepDTO, UpdateStepDTO } from '../../../../core/models/step-dto';
import { StepStatus } from '../../../../core/models/enums/step-status';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { Status } from "../../../../core/models/enums/status";

@Component({
  selector: 'app-add-edit-test-result',
  templateUrl: './add-edit-test-result.component.html',
  styleUrls: ['./add-edit-test-result.component.less']
})
export class AddEditTestResultComponent implements OnInit, OnDestroy {
  testResultForm: FormGroup;
  steps: StepDTO[] = [];
  testCaseId: string;
  projectId: string;
  users: UserDTO[] = [];
  testCaseDescription: string = '';

  // Static event emitter to signal changes
  static testResultUpdated: EventEmitter<void> = new EventEmitter<void>();

  private subscriptions: Subscription[] = []; // For managing subscriptions and preventing memory leaks

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private testCaseService: TestCaseService,
    private stepService: StepService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.testResultForm = this.fb.group({
      status: ['', Validators.required],
      comment: [''],
      assignTo: [null], // Початкове значення має бути null
      elapsed: ['']
    });

    const routeSubscription = this.route.paramMap.subscribe(params => {
      this.testCaseId = params.get('testCaseId')!;

      this.route.parent?.parent?.parent?.paramMap.subscribe((params) => {
        this.projectId = params.get('projectId')!;
      });

      if (!this.projectId || !this.testCaseId) {
        console.error('Project ID or Test Case ID is missing!');
        this.router.navigate(['/']);
        return;
      }

      // Завантаження деталей тесткейсу для відображення description та ініціалізації форми
      this.testCaseService.getTestCase(this.testCaseId).subscribe(testCase => {
        this.testCaseDescription = testCase.description;

        // Знаходимо відповідного користувача з масиву users
        const assignedUser = this.users.find(user => user.userId === testCase.assignedUserId);

        this.testResultForm.patchValue({
          assignTo: assignedUser || null, // Присвоюємо об'єкт UserDTO або null, якщо користувача не знайдено
          status: testCase.status,
          elapsed: testCase.timeEstimation
        });
      });

      this.stepService.getStepsByTestCaseId(this.testCaseId).subscribe(steps => {
        this.steps = steps;
      });

      this.userService.getProjectUsers(this.projectId).pipe(
        switchMap((userIds: string[]) =>
          forkJoin(userIds.map(id => this.userService.getUser(id)))
        )
      ).subscribe((users: UserDTO[]) => {
        this.users = users;
      });
    });
    this.subscriptions.push(routeSubscription); // Add subscription to the array
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }

  onClosePopup(): void {
    // Закриття попапа: повернення на попередню сторінку
    this.location.back();
  }

  onStartElapsed(event: Event): void {
    event.preventDefault();
    // Встановлення поточної дати (у форматі YYYY-MM-DD) в поле elapsed
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    this.testResultForm.patchValue({ elapsed: todayString });
    // Тут можна відкрити календар, якщо інтегровано відповідний віджет
  }

  onSubmit(): void {
    const assignToUser: UserDTO = this.testResultForm.value.assignTo;
    const assignedUserId = assignToUser ? assignToUser.userId : null;

    console.log('assignedUserId before updateTestCaseDTO:', assignedUserId); // Додали журнал

    // Підготовка об'єкта оновлення для тесткейсу
    const updateTestCaseDTO = {
      testCaseId: this.testCaseId,
      status: this.testResultForm.value.status,
      timeEstimation: this.testResultForm.value.elapsed,
      assignedUserId: assignedUserId, // Використовуємо userId
      description: this.testCaseDescription
    };

    console.log('updateTestCaseDTO before API call:', updateTestCaseDTO); // Додали журнал

    // Якщо тесткейс не має кроків, одразу оновлюємо тесткейс
    if (this.steps.length === 0) {
      this.testCaseService.updateTestCase(this.testCaseId, updateTestCaseDTO).subscribe(
        updatedTestCase => {
          console.log('Test case updated successfully:', updatedTestCase); // Додали журнал
          // Emit the event after a successful update
          AddEditTestResultComponent.testResultUpdated.emit();
          this.location.back(); // Повернення після успішного оновлення
        },
        error => {
          console.error('Error updating test case:', error);
        }
      );
      return;
    }

    // Оновлення статусу для кожного кроку
    const stepUpdateObservables: Observable<any>[] = this.steps.map(step => {
      const updateStepDTO: UpdateStepDTO = {
        stepId: step.stepId,
        stepStatus: step.stepStatus  // Перетворення статусу в верхній регістр
      };
      return this.stepService.updateStep(step.stepId, updateStepDTO);
    });

    // Виконання оновлень кроків одночасно
    forkJoin(stepUpdateObservables).subscribe(
      () => {
        // Після оновлення кроків оновлюємо тесткейс
        this.testCaseService.updateTestCase(this.testCaseId, updateTestCaseDTO).subscribe(
          updatedTestCase => {
            console.log('Test case updated successfully:', updatedTestCase); // Додали журнал
            // Emit the event after a successful update
            AddEditTestResultComponent.testResultUpdated.emit();
            this.location.back(); // Повернення після успішного оновлення
          },
          error => {
            console.error('Error updating test case:', error);
          }
        );
      },
      error => {
        console.error('Error updating steps:', error);
      }
    );
  }

  getHeaderColor(): string {
    switch (this.testResultForm.get('status')?.value) {
      case 'Passed':
        return '#2E7D38';
      case 'Failed':
        return '#AF093E';
      case 'Blocked':
        return '#4B4B4B';
      case 'Retest':
        return '#AF970B';
      default:
        return '#7A7A78';
    }
  }

  compareUserIds(user1: UserDTO, user2: UserDTO): boolean {
    return user1 && user2 ? user1.userId === user2.userId : user1 === user2;
  }

  protected readonly StepStatus = StepStatus;
  protected readonly Status = Status;
}
