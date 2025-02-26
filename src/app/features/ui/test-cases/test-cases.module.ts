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
import { AddEditSectionComponent } from './add-edit-section/add-edit-section.component';
import { AddEditSubsectionComponent } from './add-edit-subsection/add-edit-subsection.component';
import { TestCaseSectionsComponent } from './test-case-sections/test-case-sections.component';
import { HierarchyItemComponent } from './hierarchy-item/hierarchy-item.component';



@NgModule({
  declarations: [
    TestCasesComponent,
    AddTestCaseComponent,
    SelectTestCasesComponent,
    AddEditSectionComponent,
    AddEditSubsectionComponent,
    TestCaseSectionsComponent,
    HierarchyItemComponent
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
