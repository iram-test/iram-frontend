import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { AddEditSectionComponent } from './add-edit-section/add-edit-section.component';
import { AddEditSubsectionComponent } from './add-edit-subsection/add-edit-subsection.component';
import { TestCaseSectionsComponent } from './test-case-sections/test-case-sections.component';
import { SelectCasesComponent } from './select-cases/select-cases.component';
import { TestCaseDetailsComponent } from './test-case-details/test-case-details.component';

const routes: Routes = [
  {
    path: '',
    component: TestCaseSectionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-test-case',
    component: AddTestCaseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-section',
    component: AddEditSectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-section/:id',
    component: AddEditSectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-subsection',
    component: AddEditSubsectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-subsection/:id',
    component: AddEditSubsectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'select-cases',
    component: SelectCasesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TestCasesRoutingModule { }
