// test-case-sections.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SectionService } from '../../../../core/services/section.service';
import { TestCaseService } from '../../../../core/services/test-case.service';
import { SubsectionService } from '../../../../core/services/subsection.service';
import { FileService } from '../../../../core/services/file.service';
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
  selectedSectionId: string | null = null;
  selectedTestCases: string[] = []; // Array to store selected test case IDs
  private destroy$ = new Subject<void>();
  sectionsLength: number = 0;
  subsectionsLength: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private testCaseService: TestCaseService,
    private subsectionService: SubsectionService,
    private fileService: FileService
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
          this.sectionsLength = sections.length;
          this.subsectionsLength = subsections.length;
          this.hierarchy = this.buildHierarchy(sections, subsections, testCases, this.projectId!);
        },
        error: (error) => { console.error("Error loading data:", error); }
      });
  }

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
      const parentSection = sectionMap.get(subsection.sectionId);
      if (parentSection) {
        parentSection.children!.push(subsectionItem);
      }
    });

    testCases.forEach(testCase => {
      let parent: HierarchyItem | undefined;

      if (testCase.sectionId) {
        if (subsectionMap.has(testCase.sectionId)) {
          parent = subsectionMap.get(testCase.sectionId);
        } else {
          parent = sectionMap.get(testCase.sectionId);
        }
      }

      if (!parent) {
        parent = projectItem;
      }

      parent.testCases!.push(testCase);
    });
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

  handleSectionSelected(selectedSectionId: string) {
    this.selectedSectionId = selectedSectionId;
  }

  onFileSelected(event: any, type: 'json' | 'csv') {
    const file: File = event.target.files[0];
    if (file) {
      if (type === 'json') {
        this.fileService.importTestCasesFromJson(file).subscribe({
          next: (response) => {
            console.log('Import successful:', response);
            this.loadData();
          },
          error: (error) => {
            console.error('Import error:', error);
          }
        });
      } else if (type === 'csv') {
        this.fileService.importTestCasesFromCsv(file).subscribe({
          next: (response) => {
            console.log('Import successful:', response);
            this.loadData();
          },
          error: (error) => {
            console.error('Import error:', error);
          }
        });
      }
    }
  }

  handleTestCaseSelected(testCaseId: string) {
    if (this.selectedTestCases.includes(testCaseId)) {
      this.selectedTestCases = this.selectedTestCases.filter(id => id !== testCaseId)
    } else {
      this.selectedTestCases = [...this.selectedTestCases, testCaseId];
    }
  }

  exportTestCases(format: 'json' | 'csv' | 'xml') {
    if (this.selectedTestCases.length === 0) {
      alert('Please select at least one test case to export.');
      return;
    }

    this.fileService.exportTestCases(this.selectedTestCases, format)
      .subscribe({
        next: (blob) => {
          this.fileService.downloadFile(blob, `test_cases.${format}`);
        },
        error: (error) => {
          console.error('Export error:', error);
        }
      });
  }


  protected readonly document = document;
}
