import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestRunsComponent } from './test-runs/test-runs.component';
import { TestRunsRoutingModule } from './test-runs-routing.module';
import { AddTestRunComponent } from './add-test-run/add-test-run.component';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestRunDetailsComponent } from './test-run-details/test-run-details.component';



@NgModule({
  declarations: [
    TestRunsComponent,
    AddTestRunComponent,
    TestRunDetailsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TestRunsRoutingModule
  ]
})
export class TestRunsModule { }
