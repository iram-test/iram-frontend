import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestRunsComponent } from './test-runs/test-runs.component';
import { AddTestRunComponent } from './add-test-run/add-test-run.component';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { TestRunDetailsComponent } from './test-run-details/test-run-details.component';
import { AddEditTestRunComponent } from './add-edit-test-run/add-edit-test-run.component';
import { AddEditTestResultComponent } from './add-edit-test-result/add-edit-test-result.component';

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
  },
  {
    path: 'edit-test-run/:id',
    component: AddEditTestRunComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'test-run-details',
    component: TestRunDetailsComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRunsRoutingModule { }
