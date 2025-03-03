import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HierarchyItem } from '../../../../core/models/hierarchy-item';
import { Router, ActivatedRoute } from '@angular/router';
import { TestCaseService } from '../../../../core/services/test-case.service'; // Шлях до сервісу може відрізнятися

@Component({
  selector: 'app-hierarchy-item',
  templateUrl: './hierarchy-item.component.html',
  styleUrls: ['./hierarchy-item.component.less']
})
export class HierarchyItemComponent {
  @Input() item!: HierarchyItem;
  @Input() selectedSectionId: string | null = null;
  @Input() isRoot = false;
  @Output() sectionSelected = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private testCaseService: TestCaseService
  ) { }

  toggleExpanded() {
    if (this.item.type !== 'testCase') {
      this.item.expanded = !this.item.expanded;
    }
  }

  onSectionSelect(itemId: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.item.type === 'section' || this.item.type === 'subsection') {
      const queryParamsKey = this.item.type === 'section' ? 'sectionId' : 'subsectionId';
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [queryParamsKey]: itemId },
        queryParamsHandling: 'merge',
      });
      this.sectionSelected.emit(itemId);
    }
  }

  navigateToTestCaseDetails(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  navigateEditTestCase(id: string) {
    this.router.navigate(['edit-test-case', id], { relativeTo: this.route });
  }

  // Новий метод для видалення тест кейсу
  deleteTestCase(testCaseId: string) {
      this.testCaseService.deleteTestCase(testCaseId).subscribe({
        next: () => {
          // Оновлюємо локальний список тест кейсів
          if (this.item.testCases) {
            this.item.testCases = this.item.testCases.filter(tc => tc.testCaseId !== testCaseId);
          }
        },
        error: err => {
          console.error('Не вдалося видалити тест кейс:', err);
        }
      });
  }
}
