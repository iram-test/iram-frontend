import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MilestonesComponent } from './milestones/milestones.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { AuthGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'milestones',
    component: MilestonesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-milestone',
    component: AddMilestoneComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MilestonesRoutingModule { }
