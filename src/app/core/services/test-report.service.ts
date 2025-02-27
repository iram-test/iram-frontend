import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TestReportDTO,
  CreateTestReportDTO,
  UpdateTestReportDTO,
} from '../models/test-report-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TestReportService extends BaseService {
  private readonly testReportsUrl = 'test-reports';

  constructor(http: HttpClient) {
    super(http);
  }

  getTestReports(): Observable<TestReportDTO[]> {
    return this.get<TestReportDTO[]>(this.testReportsUrl);
  }

  getTestReport(id: string): Observable<TestReportDTO> {
    return this.get<TestReportDTO>(`${this.testReportsUrl}/${id}`);
  }

  createTestReport(
    testReport: CreateTestReportDTO,
    projectId: string,
  ): Observable<TestReportDTO> {
    return this.post<TestReportDTO>(
      `/projects/${projectId}/test-reports`,
      testReport,
    );
  }

  updateTestReport(
    id: string,
    testReport: UpdateTestReportDTO,
  ): Observable<TestReportDTO> {
    return this.put<TestReportDTO>(`${this.testReportsUrl}/${id}`, testReport);
  }

  deleteTestReport(id: string): Observable<void> {
    return this.delete<void>(`${this.testReportsUrl}/${id}`);
  }

  getTestReportsByAssignedUserId(assignedUserId: string): Observable<TestReportDTO[]> {
    return this.get<TestReportDTO[]>(`/users/${assignedUserId}/test-reports`);
  }

  getTestReportByName(reportName: string): Observable<TestReportDTO | null> {
    return this.get<TestReportDTO>(`${this.testReportsUrl}/name/${reportName}`);
  }

  getTestReportsByProjectId(projectId: string): Observable<TestReportDTO[]> {
    return this.get<TestReportDTO[]>(`/projects/${projectId}/test-reports`);
  }

  getTestReportsByUserId(userId: string): Observable<TestReportDTO[]> {
    return this.get<TestReportDTO[]>(`/users/${userId}/test-reports`);
  }
}