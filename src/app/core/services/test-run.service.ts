import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TestRunDTO,
  CreateTestRunDTO,
  UpdateTestRunDTO,
} from '../models/test-run-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TestRunService extends BaseService {
  private readonly testRunsUrl = 'test-runs';

  constructor(http: HttpClient) {
    super(http);
  }

  getTestRuns(): Observable<TestRunDTO[]> {
    return this.get<TestRunDTO[]>(this.testRunsUrl);
  }

  getTestRun(id: string): Observable<TestRunDTO> {
    return this.get<TestRunDTO>(`${this.testRunsUrl}/${id}`);
  }

  createTestRun(
    testRun: CreateTestRunDTO,
    projectId: string,
  ): Observable<TestRunDTO> {
    return this.post<TestRunDTO>(
      `projects/${projectId}/test-runs`,
      testRun,
    );
  }

  updateTestRun(id: string, testRun: UpdateTestRunDTO): Observable<TestRunDTO> {
    return this.put<TestRunDTO>(`${this.testRunsUrl}/${id}`, testRun);
  }

  deleteTestRun(id: string): Observable<void> {
    return this.delete<void>(`${this.testRunsUrl}/${id}`);
  }

  getTestRunByProjectId(projectId: string): Observable<TestRunDTO[]> {
    return this.get<TestRunDTO[]>(`projects/${projectId}/test-runs`);
  }

  getTestRunByUserId(userId: string): Observable<TestRunDTO[]> {
    return this.get<TestRunDTO[]>(`users/${userId}/test-runs`);
  }

  getTestRunByTestReportId(testReportId: string): Observable<TestRunDTO[]> {
    return this.get<TestRunDTO[]>(`test-reports/${testReportId}/test-runs`);
  }
}
