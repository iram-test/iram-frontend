import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { InternalMenuComponent } from './components/internal-menu/internal-menu.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditProjectComponent } from './components/add-edit-project/add-edit-project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModule } from '../features/authentication/authentication.module';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

@NgModule({
  declarations: [
    NavMenuComponent,
    InternalMenuComponent,
    LandingPageComponent,
    DashboardComponent,
    AddEditProjectComponent,
    ProjectDetailsComponent,
    ProjectOverviewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [NavMenuComponent, InternalMenuComponent, LandingPageComponent, DashboardComponent]
})
export class CoreModule { }
