import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HierarchyItem } from '../../../../core/models/hierarchy-item';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private router: Router, private route: ActivatedRoute) { }

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

  navigateEditTestCase(id: string) {
    this.router.navigate(['edit-test-case', id], { relativeTo: this.route });
  }
}
