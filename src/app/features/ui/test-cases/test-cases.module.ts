import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { TestCasesRoutingModule } from './test-cases-routing.module';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { CoreModule } from '../../../core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    TestCasesComponent,
    AddTestCaseComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    TestCasesRoutingModule
  ]
})
export class TestCasesModule { }
