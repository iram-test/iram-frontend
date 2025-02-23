import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../models/project-entity';
import { Language } from '../../models/enums/language';
import { Location } from '../../models/enums/location';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent {
  projects: Project[];

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    this.projects = [
      {
        projectId: '1',
        name: 'Laptop Shop',
        language: Language.ENGLISH,
        location: Location.UK,
        description: 'Description for first project',
        managerId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        users: ['admin']
      },
      {

        projectId: '2',
        name: 'Volvo Inc.',
        language: Language.POLISH,
        location: Location.PL,
        description: 'Description for Volvo project',
        managerId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        users: ['admin', 'oleh02']
      }
    ];
  }

  navigateProjectOverview(projectId: string) {
    this.router.navigate(['/project-overview', projectId])
  }

  navigateEditProject(projectId: string) {
    this.router.navigate(['/edit-project', projectId])
  }

  addProject() {
    this.router.navigate(['/add-project']);
  }
}
