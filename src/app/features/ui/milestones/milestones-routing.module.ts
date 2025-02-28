import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MilestonesComponent } from './milestones/milestones.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { EditMilestoneComponent } from './edit-milestone/edit-milestone.component';

const routes: Routes = [
  {
    path: '',
    component: MilestonesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-milestone',
    component: EditMilestoneComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit-milestone/:id",
    component: EditMilestoneComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilestonesRoutingModule { }
