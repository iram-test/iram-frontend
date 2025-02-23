import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StepDTO, CreateStepDTO, UpdateStepDTO } from '../models/step-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
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
}
