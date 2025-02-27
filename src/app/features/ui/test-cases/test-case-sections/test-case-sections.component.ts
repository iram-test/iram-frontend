import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SectionService } from '../../../../core/services/section.service';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { SubsectionService } from '../../../../core/services/subsection.service';
import { Subject, takeUntil, forkJoin, of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HierarchyItem } from '../../../../core/models/hierarchy-item';
import { SectionDTO } from '../../../../core/models/section-dto';
import { SubsectionDTO } from '../../../../core/models/subsection-dto';
import { TestCaseDTO } from '../../../../core/models/test-case-dto';


@Component({
  selector: 'app-test-case-sections',
  templateUrl: './test-case-sections.component.html',
  styleUrls: ['./test-case-sections.component.less']
})
export class TestCaseSectionsComponent implements OnInit, OnDestroy {
  hierarchy: HierarchyItem[] = [];
  projectId: string | null = null;
  selectedSectionId: string | null = null; // OR subsectionId
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private testCaseService: TestCaseService,
    private subsectionService: SubsectionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.projectId = params.get('projectId');
      if (!this.projectId) {
        console.error('Project ID is missing!');
        this.router.navigate(['/error']);
        return;
      }
      this.loadData();
    });

    // Отримуємо sectionId або subsectionId з queryParams
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedSectionId = params['sectionId'] || params['subsectionId'] || null;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    if (!this.projectId) return;

    forkJoin({
      sections: this.sectionService.getSectionsByProjectId(this.projectId),
      testCases: this.testCaseService.getTestCasesByProjectId(this.projectId),
      subsections: this.loadAllSubsections(this.projectId)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ sections, testCases, subsections }) => {
          console.log("Data from services:", { sections, testCases, subsections }); // ДОДАЙТЕ ЦЕ
          this.hierarchy = this.buildHierarchy(sections, subsections, testCases, this.projectId!);
        },
        error: (error) => { console.error("Error loading data:", error); }
      });
  }
  // Ефективне завантаження всіх підсекцій для проекту
  private loadAllSubsections(projectId: string): Observable<SubsectionDTO[]> {
    return this.sectionService.getSectionsByProjectId(projectId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(sections => {
          if (sections.length === 0) {
            return of([]);
          }
          const subsectionObservables = sections.map(section =>
            this.subsectionService.getSubsectionsBySectionId(section.sectionId)
              .pipe(
                map(subsections => {
                  // Додаємо sectionId до кожної підсекції
                  return subsections.map(sub => ({ ...sub, sectionId: section.sectionId }));
                })
              )
          );
          return forkJoin(subsectionObservables).pipe(
            map(subsectionsArray => subsectionsArray.flat())
          );
        }),
        catchError(error => {
          console.error("Error loading subsections:", error);
          return of([]);
        })
      );
  }
  private buildHierarchy(
    sections: SectionDTO[],
    subsections: SubsectionDTO[],
    testCases: TestCaseDTO[],
    projectId: string
  ): HierarchyItem[] {
    console.log("Sections:", sections);
    console.log("Subsections:", subsections);
    console.log("TestCases:", testCases);

    const projectItem: HierarchyItem = {
      id: projectId,
      name: 'Root',
      type: 'project',
      children: [],
      expanded: true,
      projectId: projectId,
      testCases: []
    };

    const sectionMap = new Map<string, HierarchyItem>();
    const subsectionMap = new Map<string, HierarchyItem>();

    // 1. Створюємо ієрархію секцій та підсекцій
    sections.forEach(section => {
      const sectionItem: HierarchyItem = {
        id: section.sectionId,
        name: section.name,
        type: 'section',
        children: [],
        expanded: false,
        projectId: projectId,
        testCases: []
      };
      sectionMap.set(section.sectionId, sectionItem);
      projectItem.children!.push(sectionItem);
    });

    subsections.forEach(subsection => {
      const subsectionItem: HierarchyItem = {
        id: subsection.subsectionId,
        name: subsection.name,
        type: 'subsection',
        children: [],
        expanded: false,
        projectId: projectId,
        testCases: []
      };
      subsectionMap.set(subsection.subsectionId, subsectionItem);
      const parentSection = sectionMap.get(subsection.sectionId); // ТЕПЕР ТУТ ПРАВИЛЬНИЙ sectionId
      if (parentSection) {
        parentSection.children!.push(subsectionItem);
      }
    });
    console.log("sectionMap", sectionMap)
    console.log("subsectionMap", subsectionMap)

    // 2. Додаємо тест-кейси до відповідних секцій/підсекцій
    testCases.forEach(testCase => {
      let parent: HierarchyItem | undefined;

      if (testCase.sectionId) {
        if (subsectionMap.has(testCase.sectionId)) {
          parent = subsectionMap.get(testCase.sectionId);
          console.log(`Test case ${testCase.title} added to subsection ${testCase.sectionId}`);
        } else {
          parent = sectionMap.get(testCase.sectionId);
          console.log(`Test case ${testCase.title} added to section ${testCase.sectionId}`);
        }
      }

      if (!parent) {
        parent = projectItem;
        console.log(`Test case ${testCase.title} added to project`);
      }

      parent.testCases!.push(testCase);
    });

    console.log("projectItem", projectItem)
    return [projectItem];
  }


  navigateAddTestCase() {
    this.router.navigate(['add-test-case'], { relativeTo: this.route, queryParams: { sectionId: this.selectedSectionId } });
  }

  navigateAddSection() {
    this.router.navigate(['add-section'], { relativeTo: this.route });
  }

  navigateAddSubsection() {
    if (this.selectedSectionId) {
      this.router.navigate(['add-subsection'], { relativeTo: this.route, queryParams: { sectionId: this.selectedSectionId } });
    } else {
      console.error('Please select a section first.');
    }
  }

  // Обробка вибору секції/підсекції (спрощено)
  handleSectionSelected(selectedSectionId: string) {
    this.selectedSectionId = selectedSectionId;
  }
}
