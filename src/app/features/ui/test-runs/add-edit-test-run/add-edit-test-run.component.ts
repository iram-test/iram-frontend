import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserDTO } from "../../../../core/models/user-dto";
import { MilestoneDTO } from "../../../../core/models/milestone-dto";
import { TestCaseDTO } from "../../../../core/models/test-case-dto";
import { TestRunService } from "../../../../core/services/test-run.service";
import { UserService } from "../../../../core/services/user.service";
import { MilestoneService } from "../../../../core/services/milestone.service";
import { TestCaseService } from "../../../../core/services/test-case.service";
import { CreateTestRunDTO, UpdateTestRunDTO } from "../../../../core/models/test-run-dto";
import { AddEditTestResultComponent } from "../add-edit-test-result/add-edit-test-result.component";

interface SelectableTestCaseDTO extends TestCaseDTO {
  checked: boolean;
}

@Component({
  selector: 'app-add-edit-test-run',
  templateUrl: './add-edit-test-run.component.html',
  styleUrls: ['./add-edit-test-run.component.less']
})
export class AddEditTestRunComponent implements OnInit, OnDestroy {
  projectId: string;
  users: UserDTO[] = [];
  milestones: MilestoneDTO[] = [];
  testRunForm: FormGroup;
  selectedCases: SelectableTestCaseDTO[] = [];
  showSelectedCases = false;
  allTestCases: TestCaseDTO[] = [];
  showSelectCasesPopup = false;
  id: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private testRunService: TestRunService,
    private userService: UserService,
    private milestoneService: MilestoneService,
    private testCaseService: TestCaseService
  ) {
    this.testRunForm = this.fb.group({
      name: ['', Validators.required],
      assignedUserId: [null],
      milestoneId: [null],
      description: [''],
      includeAllCases: [true],
      testCaseIds: [[]]
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          this.id = params.get('id');
          return this.route.parent?.paramMap;
        }),
        switchMap(parentParams => {
          this.projectId = parentParams.get('projectId');
          return combineLatest([
            this.userService.getProjectUsers(this.projectId).pipe(
              switchMap(userIds => combineLatest(userIds.map(userId => this.userService.getUser(userId))))
            ),
            this.milestoneService.getMilestonesByProjectId(this.projectId),
            this.testCaseService.getTestCasesByProjectId(this.projectId)
          ]);
        })
      ).subscribe(([users, milestones, testCases]) => {
        this.users = users;
        this.milestones = milestones;
        this.allTestCases = testCases;
        this.initializeForm();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    if (this.id) {
      this.loadTestRunData();
    } else {
      this.setupFormChanges();
    }
  }

  private loadTestRunData(): void {
    this.testRunService.getTestRun(this.id)
      .subscribe(testRun => {
        this.testRunForm.patchValue({
          name: testRun.name,
          assignedUserId: testRun.assignedUserIds ? testRun.assignedUserIds[0] : null,
          milestoneId: testRun.milestoneIds ? testRun.milestoneIds[0] : null,
          description: testRun.description,
          includeAllCases: testRun.testCaseIds.length === 0
        });

        this.selectedCases = this.allTestCases
          .filter(tc => testRun.testCaseIds.includes(tc.testCaseId))
          .map(tc => ({ ...tc, checked: true }));
        this.setupFormChanges();
      });
  }

  private setupFormChanges(): void {
    this.subscriptions.add(
      this.testRunForm.get('includeAllCases').valueChanges.subscribe(includeAll => {
        this.showSelectedCases = !includeAll;
        if (includeAll) {
          this.selectedCases = this.allTestCases.map(tc => ({ ...tc, checked: true }));
          this.testRunForm.get('testCaseIds').setValue(this.allTestCases.map(tc => tc.testCaseId));
        } else {
          this.testRunForm.get('testCaseIds').setValue(this.selectedCases.map(c => c.testCaseId));
        }
      })
    );

    this.loadSelectedCases();
  }

  private loadSelectedCases(): void {
    const savedCases = localStorage.getItem('selectedCases');
    if (savedCases) {
      const caseIds = JSON.parse(savedCases);
      this.selectedCases = this.allTestCases
        .filter(tc => caseIds.includes(tc.testCaseId))
        .map(tc => ({ ...tc, checked: true }));
      this.testRunForm.patchValue({
        testCaseIds: caseIds,
        includeAllCases: false
      });
      this.showSelectedCases = true;
    }
  }

  selectSpecificCases() {
    this.showSelectCasesPopup = true;
  }

  onSelectionConfirmed(selectedCaseIds: string[]) {
    this.showSelectCasesPopup = false;
    this.selectedCases = this.allTestCases
      .filter(tc => selectedCaseIds.includes(tc.testCaseId))
      .map(tc => ({ ...tc, checked: true }));
    this.testRunForm.patchValue({
      testCaseIds: selectedCaseIds,
      includeAllCases: false
    });
    this.showSelectedCases = true;
  }

  onSelectionCancelled() {
    this.showSelectCasesPopup = false;
  }

  getDisplayName(user: UserDTO): string {
    return `${user.firstName} ${user.lastName}`;
  }

  onIncludeAllCasesChange() {
    // Handled by valueChanges subscription
  }

  onSubmit() {
    if (this.testRunForm.valid) {
      const formData = this.testRunForm.value;
      const milestoneId = formData.milestoneId ? formData.milestoneId : null;
      const assignedUserId = formData.assignedUserId ? formData.assignedUserId : null;
      let testCaseIds: string[] = [];

      if (formData.includeAllCases) {
        testCaseIds = this.allTestCases.map(tc => tc.testCaseId);
      } else {
        testCaseIds = this.selectedCases.map(c => c.testCaseId);
      }

      const testRunData = {
        name: formData.name,
        milestoneId: milestoneId,
        assignedUserId: assignedUserId,
        description: formData.description,
        testCaseIds: testCaseIds
      };

      if (this.id) {
        (testRunData as UpdateTestRunDTO).testRunId = this.id;
        this.testRunService.updateTestRun(this.id, testRunData as UpdateTestRunDTO).subscribe({
          next: (updatedTestRun) => {
            console.log('Test Run Updated:', updatedTestRun);
            AddEditTestResultComponent.testResultUpdated.emit();
            // this.router.navigate(['/project-overview', this.projectId, 'test-runs']);
          },
          error: (error) => {
            console.error('Error updating test run:', error);
          }
        });
      } else {
        this.testRunService.createTestRun(testRunData as CreateTestRunDTO, this.projectId).subscribe({
          next: (createdTestRun) => {
            console.log('Test Run Created:', createdTestRun);
            AddEditTestResultComponent.testResultUpdated.emit();
            // this.router.navigate(['/project-overview', this.projectId, 'test-runs']);
          },
          error: (error) => {
            console.error('Error creating test run:', error);
          }
        });
      }
    } else {
      console.log('Form is not valid');
    }
  }

  onCancel() {
    this.resetForm();
    // this.router.navigate(['/project-overview', this.projectId, 'test-runs']);
  }

  resetForm() {
    this.testRunForm.reset({
      includeAllCases: true,
      testCaseIds: []
    });
    this.selectedCases = [];
    this.showSelectedCases = false;
    localStorage.removeItem('selectedCases');
    localStorage.removeItem('addTestRunState');
  }
}
