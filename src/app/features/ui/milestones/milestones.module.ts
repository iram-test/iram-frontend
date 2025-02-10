import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestonesComponent } from './milestones/milestones.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { MilestonesRoutingModule } from './milestones-routing.module';



@NgModule({
  declarations: [
    MilestonesComponent,
    AddMilestoneComponent
  ],
  imports: [
    CommonModule,
    MilestonesRoutingModule
  ]
})
export class MilestonesModule { }
