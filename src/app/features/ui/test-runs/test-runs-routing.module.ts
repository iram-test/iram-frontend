import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestRunsComponent } from './test-runs/test-runs.component';
import { AddTestRunComponent } from './add-test-run/add-test-run.component';
import { AuthGuard } from '../../../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'test-runs',
    component: TestRunsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-test-run',
    component: AddTestRunComponent,
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
export class TestRunsRoutingModule { }
