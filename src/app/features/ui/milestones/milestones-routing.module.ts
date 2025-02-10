import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MilestonesComponent } from './milestones/milestones.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';

const routes: Routes = [
  {
    path: 'milestones',
    component: MilestonesComponent
  },
  {
    path: 'add-milestone',
    component: AddMilestoneComponent
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
