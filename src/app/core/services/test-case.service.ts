import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TestCaseDTO,
  CreateTestCaseDTO,
  UpdateTestCaseDTO,
} from '../models/test-case-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TestCaseService extends BaseService {
  private readonly testCasesUrl = 'test-cases';

  constructor(http: HttpClient) {
    super(http);
  }

  getTestCases(): Observable<TestCaseDTO[]> {
    return this.get<TestCaseDTO[]>(this.testCasesUrl);
  }

  getTestCase(id: string): Observable<TestCaseDTO> {
    return this.get<TestCaseDTO>(`${this.testCasesUrl}/${id}`);
  }

  createTestCase(
    testCase: CreateTestCaseDTO,
    projectId: string,
  ): Observable<TestCaseDTO> {
    return this.post<TestCaseDTO>(
      `projects/${projectId}/test-cases`,
      testCase,
    );
  }

  updateTestCase(
    id: string,
    testCase: UpdateTestCaseDTO,
  ): Observable<TestCaseDTO> {
    return this.put<TestCaseDTO>(`${this.testCasesUrl}/${id}`, testCase);
  }

  deleteTestCase(id: string): Observable<void> {
    return this.delete<void>(`${this.testCasesUrl}/${id}`);
  }

  getTestCasesByProjectId(projectId: string): Observable<TestCaseDTO[]> {
    return this.get<TestCaseDTO[]>(`projects/${projectId}/test-cases`);
  }

  getTestCasesBySectionId(sectionId: string): Observable<TestCaseDTO[]> {
    return this.get<TestCaseDTO[]>(`sections/${sectionId}/test-cases`);
  }

  getTestCasesBySubSectionId(subsectionId: string): Observable<TestCaseDTO[]> {
    return this.get<TestCaseDTO[]>(`subsections/${subsectionId}/test-cases`);
  }

  getTestCasesByAssignedUserId(assignedUserId: string): Observable<TestCaseDTO[]> {
    return this.get<TestCaseDTO[]>(`users/${assignedUserId}/test-cases`);
  }

  getTestCaseByTitle(title: string): Observable<TestCaseDTO | null> {
    return this.get<TestCaseDTO>(`${this.testCasesUrl}/title/${title}`);
  }
}