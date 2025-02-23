import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubsectionDTO, CreateSubsectionDTO, UpdateSubsectionDTO } from '../models/subsection-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SubsectionService extends BaseService {

  private readonly subsectionsUrl = 'subsections';

  constructor(http: HttpClient) {
    super(http);
  }

  getSubsections(): Observable<SubsectionDTO[]> {
    return this.get<SubsectionDTO[]>(this.subsectionsUrl);
  }

  getSubsection(id: string): Observable<SubsectionDTO> {
    return this.get<SubsectionDTO>(`${this.subsectionsUrl}/${id}`);
  }

  createSubsection(subsection: CreateSubsectionDTO, sectionId: string): Observable<SubsectionDTO> {
    return this.post<SubsectionDTO>(`sections/${sectionId}/subsections`, subsection);
  }

  updateSubsection(id: string, subsection: UpdateSubsectionDTO): Observable<SubsectionDTO> {
    return this.put<SubsectionDTO>(`${this.subsectionsUrl}/${id}`, subsection);
  }

  deleteSubsection(id: string): Observable<void> {
    return this.delete<void>(`${this.subsectionsUrl}/${id}`);
  }
}
