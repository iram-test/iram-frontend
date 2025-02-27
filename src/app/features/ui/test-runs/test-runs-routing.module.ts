import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestRunsComponent } from './test-runs/test-runs.component';
import { AddTestRunComponent } from './add-test-run/add-test-run.component';
import { AuthGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRunsRoutingModule { }
