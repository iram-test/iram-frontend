import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HierarchyItem } from '../../../../core/models/hierarchy-item';
import { Router, ActivatedRoute } from '@angular/router';
import { TestCaseService } from '../../../../core/services/test-case.service';

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
  @Output() testCaseSelected = new EventEmitter<string>(); // For checkbox selection
  @Input() selectedTestCases: string[] = [];


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

  deleteTestCase(testCaseId: string) {
    this.testCaseService.deleteTestCase(testCaseId).subscribe({
      next: () => {
        if (this.item.testCases) {
          this.item.testCases = this.item.testCases.filter(tc => tc.testCaseId !== testCaseId);
        }
      },
      error: err => {
        console.error('Failed to delete test case:', err);
      }
    });
  }

  onTestCaseSelect(testCaseId: string) {
    if (this.selectedTestCases.includes(testCaseId)) {
      this.selectedTestCases = this.selectedTestCases.filter(id => id !== testCaseId);
    } else {
      this.selectedTestCases = [...this.selectedTestCases, testCaseId];
    }
    this.testCaseSelected.emit(testCaseId); // Emit the event
  }

  isSelected(testCaseId: string): boolean {
    return this.selectedTestCases.includes(testCaseId);
  }
}
