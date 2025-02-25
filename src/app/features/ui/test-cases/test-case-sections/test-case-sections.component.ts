import { Component } from '@angular/core';
import { SectionDTO } from '../../../../core/models/section-dto';
import { SubsectionDTO } from '../../../../core/models/subsection-dto';
import { TestCaseDTO } from '../../../../core/models/test-case-dto';
import { Router } from '@angular/router';
import { TemplateType } from '../../../../core/models/enums/template-type';
import { TestType } from '../../../../core/models/enums/test-type';
import { Priority } from '../../../../core/models/enums/project-priority';

@Component({
  selector: 'app-test-case-sections',
  templateUrl: './test-case-sections.component.html',
  styleUrl: './test-case-sections.component.less'
})
export class TestCaseSectionsComponent {
  sections: SectionDTO[];
  subSections: SubsectionDTO[];
  testCases: TestCaseDTO[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    let testCase1: TestCaseDTO = {
      testCaseId: '',
      title: 'Test Case 1',
      sectionId: '',
      projectId: '',
      assignedUserId: '',
      templateType: TemplateType.STEPS,
      testType: TestType.ACCESSIBILITY,
      priority: Priority.LOW,
      timeEstimation: '',
      description: '',
      stepIds: [],
      createdAt: '',
      updatedAt: ''
    };

    let testCase2: TestCaseDTO = {
      testCaseId: '',
      title: 'Test Case 2',
      sectionId: '',
      projectId: '',
      assignedUserId: '',
      templateType: TemplateType.STEPS,
      testType: TestType.ACCESSIBILITY,
      priority: Priority.LOW,
      timeEstimation: '',
      description: '',
      stepIds: [],
      createdAt: '',
      updatedAt: ''
    };

    let section1: SectionDTO = {
      sectionId: '',
      name: 'Section 1',
      description: '',
      subsectionIds: [],
      createdAt: '',
      updatedAt: ''
    }

    let section2: SectionDTO = {
      sectionId: '',
      name: 'Section 2',
      description: '',
      subsectionIds: [],
      createdAt: '',
      updatedAt: ''
    }

    let section3: SectionDTO = {
      sectionId: '',
      name: 'Section 3',
      description: '',
      subsectionIds: [],
      createdAt: '',
      updatedAt: ''
    }

    let subSection: SubsectionDTO = {
      subsectionId: '',
      name: 'Subsection 1',
      description: '',
      createdAt: '',
      updatedAt: ''
    };

    this.testCases = [testCase1, testCase2];
    this.sections = [section1, section2, section3];
    this.subSections = [subSection];
  }

  navigateAddTestCase() {
    this.router.navigate(['/add-test-case']);
  }

  navigateAddSection() {
    this.router.navigate(['/add-section']);
  }

  navigateAddSubsection() {
    this.router.navigate(['/add-subsection']);
  }
}
