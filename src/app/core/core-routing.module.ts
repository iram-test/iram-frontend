import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditProjectComponent } from './components/add-edit-project/add-edit-project.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LandingPageComponent,
    children: [
      { path: 'authentication', loadChildren: () => import('../features/authentication/authentication.module').then(m => m.AuthenticationModule) }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-project',
    component: AddEditProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-project/:id',
    component: AddEditProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project-overview/:id',
    component: ProjectOverviewComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
