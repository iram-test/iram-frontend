import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StepDTO, CreateStepDTO, UpdateStepDTO } from '../models/step-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StepService extends BaseService {
  private readonly stepsUrl = 'steps';

  constructor(http: HttpClient) {
    super(http);
  }

  getSteps(): Observable<StepDTO[]> {
    return this.get<StepDTO[]>(this.stepsUrl);
  }

  getStep(id: string): Observable<StepDTO> {
    return this.get<StepDTO>(`${this.stepsUrl}/${id}`);
  }

  createStep(step: CreateStepDTO, testCaseId: string): Observable<StepDTO> {
    return this.post<StepDTO>(`test-cases/${testCaseId}/steps`, step);
  }

  updateStep(id: string, step: UpdateStepDTO): Observable<StepDTO> {
    return this.put<StepDTO>(`${this.stepsUrl}/${id}`, step);
  }

  deleteStep(id: string): Observable<void> {
    return this.delete<void>(`${this.stepsUrl}/${id}`);
  }

  getStepsByTestCaseId(testCaseId: string): Observable<StepDTO[]> {
    return this.get<StepDTO[]>(`test-cases/${testCaseId}/steps`);
  }

  // Endpoint для завантаження зображень для звичайних Steps
  uploadImage(projectId: string, stepId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `http://localhost:3002/api/test-cases/${projectId}/steps/${stepId}/upload-image`;
    return this.http.post(url, formData);
  }

  // Endpoint для завантаження expected images (Expected Results)
  uploadExpectedImage(projectId: string, stepId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `http://localhost:3002/api/test-cases/${projectId}/steps/${stepId}/upload-expected-image`;
    return this.http.post(url, formData);
  }

  deleteImage(stepId: string, imageUrl: string): Observable<void> {
    const url = `http://localhost:3002/api/steps/${stepId}/image`;
    return this.http.delete<void>(url, { body: { imageUrl } });
  }

  deleteExpectedImage(stepId: string, imageUrl: string): Observable<void> {
    const url = `http://localhost:3002/api/steps/${stepId}/expected-image`;
    return this.http.delete<void>(url, { body: { imageUrl } });
  }
}
