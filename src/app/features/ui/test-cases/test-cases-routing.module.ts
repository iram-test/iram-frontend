import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { SelectTestCasesComponent } from './select-test-cases/select-test-cases.component';
import { AuthGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'test-cases',
    component: TestCasesComponent,
        canActivate: [AuthGuard]
  },
  {
    path: 'add-test-case',
    component: AddTestCaseComponent,
        canActivate: [AuthGuard]
  },
  {
    path: 'select-case',
    component: SelectTestCasesComponent,
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
