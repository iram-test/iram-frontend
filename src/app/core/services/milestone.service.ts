import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MilestoneDTO, CreateMilestoneDTO, UpdateMilestoneDTO } from '../models/milestone-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService extends BaseService {

  private readonly milestonesUrl = 'milestones';

  constructor(http: HttpClient) {
    super(http);
  }

  getMilestones(): Observable<MilestoneDTO[]> {
    return this.get<MilestoneDTO[]>(this.milestonesUrl);
  }

  getMilestone(id: string): Observable<MilestoneDTO> {
    return this.get<MilestoneDTO>(`${this.milestonesUrl}/${id}`);
  }

  createMilestone(milestone: CreateMilestoneDTO, projectId: string): Observable<MilestoneDTO> {
    return this.post<MilestoneDTO>(`projects/${projectId}/milestones`, milestone);
  }

  updateMilestone(id: string, milestone: UpdateMilestoneDTO): Observable<MilestoneDTO> {
    return this.put<MilestoneDTO>(`${this.milestonesUrl}/${id}`, milestone);
  }

  deleteMilestone(id: string): Observable<void> {
    return this.delete<void>(`${this.milestonesUrl}/${id}`);
  }
}
