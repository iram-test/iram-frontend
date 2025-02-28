import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestonesComponent } from './milestones/milestones.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { MilestonesRoutingModule } from './milestones-routing.module';
import { CoreModule } from '../../../core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditMilestoneComponent } from './edit-milestone/edit-milestone.component';



@NgModule({
  declarations: [
    MilestonesComponent,
    AddMilestoneComponent,
    EditMilestoneComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    MilestonesRoutingModule
  ]
})
export class MilestonesModule { }
