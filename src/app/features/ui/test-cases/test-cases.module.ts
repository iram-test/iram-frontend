import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { TestCasesRoutingModule } from './test-cases-routing.module';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { CoreModule } from '../../../core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AddEditSectionComponent } from './add-edit-section/add-edit-section.component';
import { AddEditSubsectionComponent } from './add-edit-subsection/add-edit-subsection.component';
import { TestCaseSectionsComponent } from './test-case-sections/test-case-sections.component';
import { HierarchyItemComponent } from './hierarchy-item/hierarchy-item.component';
import { SelectCasesComponent } from './select-cases/select-cases.component';
import { TestCaseDetailsComponent } from './test-case-details/test-case-details.component';
import { StepDetailsComponent } from './step-details/step-details.component';



@NgModule({
  declarations: [
    TestCasesComponent,
    AddTestCaseComponent,
    SelectCasesComponent,
    AddEditSectionComponent,
    AddEditSubsectionComponent,
    TestCaseSectionsComponent,
    HierarchyItemComponent,
    SelectCasesComponent,
    TestCaseDetailsComponent,
    StepDetailsComponent
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
