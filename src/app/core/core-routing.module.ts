import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditProjectComponent } from './components/add-edit-project/add-edit-project.component';

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
    component: DashboardComponent
  },
  {
    path: 'add-project',
    component: AddEditProjectComponent
  },
  {
    path: 'edit-project/:id',
    component: AddEditProjectComponent
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
