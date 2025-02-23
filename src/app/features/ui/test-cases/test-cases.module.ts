import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { TestCasesRoutingModule } from './test-cases-routing.module';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { CoreModule } from '../../../core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SelectTestCasesComponent } from './select-test-cases/select-test-cases.component';



@NgModule({
  declarations: [
    TestCasesComponent,
    AddTestCaseComponent,
    SelectTestCasesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TestCasesRoutingModule
  ]
})
export class TestCasesModule { }
