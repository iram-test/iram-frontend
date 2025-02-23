import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SectionDTO, CreateSectionDTO, UpdateSectionDTO } from '../models/section-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends BaseService {

  private readonly sectionsUrl = 'sections';

  constructor(http: HttpClient) {
    super(http);
  }

  getSections(): Observable<SectionDTO[]> {
    return this.get<SectionDTO[]>(this.sectionsUrl);
  }

  getSection(id: string): Observable<SectionDTO> {
    return this.get<SectionDTO>(`${this.sectionsUrl}/${id}`);
  }

  createSection(section: CreateSectionDTO, projectId: string): Observable<SectionDTO> {
    return this.post<SectionDTO>(`projects/${projectId}/sections`, section);
  }

  updateSection(id: string, section: UpdateSectionDTO): Observable<SectionDTO> {
    return this.put<SectionDTO>(`${this.sectionsUrl}/${id}`, section);
  }

  deleteSection(id: string): Observable<void> {
    return this.delete<void>(`${this.sectionsUrl}/${id}`);
  }
}
