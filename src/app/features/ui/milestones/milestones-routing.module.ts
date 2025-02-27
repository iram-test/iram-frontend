import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MilestonesComponent } from './milestones/milestones.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { AuthGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MilestonesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-milestone',
    component: AddMilestoneComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilestonesRoutingModule { }
