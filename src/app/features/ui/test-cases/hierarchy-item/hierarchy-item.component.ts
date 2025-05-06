import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HierarchyItem } from '../../../../core/models/hierarchy-item';
import { Router, ActivatedRoute } from '@angular/router';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { SectionService } from '../../../../core/services/section.service';
import { SubsectionService } from '../../../../core/services/subsection.service';

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
    private testCaseService: TestCaseService,
    private sectionService: SectionService,
    private subsectionService: SubsectionService
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

  deleteSection(sectionId: string) {
    this.sectionService.deleteSection(sectionId).subscribe({
      next: () => {
        window.location.reload();
        console.log('Section deleted successfully');
      },
      error: err => {
        console.error('Failed to delete section:', err);
      }
    });
  }

  navigateEditSection(id: string) {
    this.router.navigate(['edit-section', id], { relativeTo: this.route });
  }
  
  navigateEditSubsection(id: string) {
    console.log(name);
    this.router.navigate(['edit-subsection', id], { relativeTo: this.route });
  }

  deleteSubsection(subsectionName: string) {
    this.subsectionService.deleteSubsection(subsectionName).subscribe({
      next: () => {
        console.log("Subsection has been deleted!")
      },
      error: err => {
        console.error('Failed to delete subsection:', err);
      }
    });
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
