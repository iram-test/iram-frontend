// select-cases.component.ts
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TestCaseDTO } from "../../../../core/models/test-case-dto";
import { TestCaseService } from "../../../../core/services/test-case.service";

interface SelectableTestCaseDTO extends TestCaseDTO {
  checked: boolean;
}

@Component({
  selector: 'app-select-cases',
  templateUrl: './select-cases.component.html',
  styleUrls: ['./select-cases.component.less']
})
export class SelectCasesComponent implements OnInit, OnDestroy {
  items: SelectableTestCaseDTO[] = [];
  private subscriptions: Subscription = new Subscription();

  @Input() projectId!: string; // Знак оклику, щоб уникнути помилки ініціалізації
  @Output() selectionConfirmed = new EventEmitter<string[]>();
  @Output() selectionCancelled = new EventEmitter<void>();

  constructor(
    private testCaseService: TestCaseService
  ) {}

  ngOnInit(): void {
    if (!this.projectId) {
      console.error('Project ID is missing!');
      return;
    }
    this.loadTestCases();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadTestCases(): void {
    this.subscriptions.add(
      this.testCaseService.getTestCasesByProjectId(this.projectId).subscribe({
        next: (testCases) => {
          this.items = testCases.map(tc => ({ ...tc, checked: false }));
          this.loadSelectedCases();
        },
        error: (error) => {
          console.error('Error loading test cases:', error);
        }
      })
    );
  }

  private loadSelectedCases(): void {
    const savedCases = localStorage.getItem('selectedCases');
    if (savedCases) {
      const selectedIds = JSON.parse(savedCases);
      this.items.forEach(item => {
        item.checked = selectedIds.includes(item.testCaseId);
      });
    }
  }

  toggleItem(index: number) {
    this.items[index].checked = !this.items[index].checked;
  }

  selectAll() {
    this.items.forEach(item => item.checked = true);
  }

  selectNone() {
    this.items.forEach(item => item.checked = false);
  }

  confirmSelection() {
    const selectedCaseIds = this.items.filter(item => item.checked).map(item => item.testCaseId);
    localStorage.setItem('selectedCases', JSON.stringify(selectedCaseIds));
    this.selectionConfirmed.emit(selectedCaseIds);
  }

  cancelSelection() {
    this.selectionCancelled.emit();
  }
}
