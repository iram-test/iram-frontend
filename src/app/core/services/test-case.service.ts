import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestCaseDTO, CreateTestCaseDTO, UpdateTestCaseDTO } from '../models/test-case-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
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

  createTestCase(testCase: CreateTestCaseDTO, projectId: string): Observable<TestCaseDTO> {
    return this.post<TestCaseDTO>(`projects/${projectId}/test-cases`, testCase);
  }

  updateTestCase(id: string, testCase: UpdateTestCaseDTO): Observable<TestCaseDTO> {
    return this.put<TestCaseDTO>(`${this.testCasesUrl}/${id}`, testCase);
  }

  deleteTestCase(id: string): Observable<void> {
    return this.delete<void>(`${this.testCasesUrl}/${id}`);
  }
}
