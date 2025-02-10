import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { InternalMenuComponent } from './components/internal-menu/internal-menu.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditProjectComponent } from './components/add-edit-project/add-edit-project.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavMenuComponent,
    InternalMenuComponent,
    LandingPageComponent,
    DashboardComponent,
    AddEditProjectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  exports: [NavMenuComponent, InternalMenuComponent, LandingPageComponent, DashboardComponent]
})
export class CoreModule { }
