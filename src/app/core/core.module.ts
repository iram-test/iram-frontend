import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { InternalMenuComponent } from './components/internal-menu/internal-menu.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditProjectComponent } from './components/add-edit-project/add-edit-project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModule } from '../features/authentication/authentication.module';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    NavMenuComponent,
    InternalMenuComponent,
    LandingPageComponent,
    DashboardComponent,
    AddEditProjectComponent,
    ProjectOverviewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreRoutingModule
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
