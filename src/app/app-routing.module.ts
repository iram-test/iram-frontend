// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/authentication/login/login.component';
import { RegisterComponent } from './features/authentication/register/register.component';
import { LandingPageComponent } from "./core/components/landing-page/landing-page.component";
import { DashboardComponent } from "./core/components/dashboard/dashboard.component";
import { AddEditProjectComponent } from "./core/components/add-edit-project/add-edit-project.component";
import { ProjectOverviewComponent } from "./core/components/project-overview/project-overview.component";  // Keep this, but it won't be the direct target
import { AuthGuard } from './core/guards/auth.guard';
import { TestCaseDetailsComponent } from './features/ui/test-cases/test-case-details/test-case-details.component';
import { AddEditTestResultComponent } from './features/ui/test-runs/add-edit-test-result/add-edit-test-result.component';
import { ProjectDetailsComponent } from './core/components/project-details/project-details.component';
import { AdministrationComponent } from './core/components/administration/administration.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'integrations', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-project', component: AddEditProjectComponent, canActivate: [AuthGuard] },
  { path: 'edit-project/:id', component: AddEditProjectComponent, canActivate: [AuthGuard] },

  // --- MAIN CHANGE:  Direct route to ProjectDetailsComponent ---
  { path: 'project-details/:projectId', component: ProjectDetailsComponent, canActivate: [AuthGuard] },

  // --- ProjectOverviewComponent is now used for nested routes *within* a project ---
  {
    path: 'project-overview/:projectId', // Keep this path for *other* routes.
    component: ProjectOverviewComponent,  // Keep ProjectOverviewComponent
    canActivate: [AuthGuard],
    children: [
      { path: 'test-cases', loadChildren: () => import('./features/ui/test-cases/test-cases.module').then(m => m.TestCasesModule) },
      { path: 'milestones', loadChildren: () => import('./features/ui/milestones/milestones.module').then(m => m.MilestonesModule) },
      { path: 'test-runs', loadChildren: () => import('./features/ui/test-runs/test-runs.module').then(m => m.TestRunsModule) },
      {
        path: 'administration',
        component: AdministrationComponent,
        canActivate: [AuthGuard]
      },
      //  NO LONGER NEEDED: { path: 'project-details', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'test-cases', pathMatch: 'full' }, //  Redirect to a default child route (e.g., test-cases)
    ]
  },

  {
    path: 'test-case-details',
    component: TestCaseDetailsComponent
  },

  {
    path: 'add-test-result',
    component: AddEditTestResultComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-test-result/:id',
    component: AddEditTestResultComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
