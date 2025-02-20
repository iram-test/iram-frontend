import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestRunsComponent } from './test-runs/test-runs.component';
import { AddTestRunComponent } from './add-test-run/add-test-run.component';

export const routes: Routes = [
  {
    path: 'test-runs',
    component: TestRunsComponent
  },
  {
    path: 'add-test-run',
    component: AddTestRunComponent
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
