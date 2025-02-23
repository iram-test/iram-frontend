import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from '../models/project-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {

  private readonly projectsUrl = 'projects';

  constructor(http: HttpClient) {
    super(http);
  }

  getProjects(): Observable<ProjectDTO[]> {
    return this.get<ProjectDTO[]>(this.projectsUrl);
  }

  getProject(id: string): Observable<ProjectDTO> {
    return this.get<ProjectDTO>(`${this.projectsUrl}/${id}`);
  }

  createProject(project: CreateProjectDTO): Observable<ProjectDTO> {
    return this.post<ProjectDTO>(this.projectsUrl, project);
  }

  updateProject(id: string, project: UpdateProjectDTO): Observable<ProjectDTO> {
    return this.put<ProjectDTO>(`${this.projectsUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.delete<void>(`${this.projectsUrl}/${id}`);
  }
}
