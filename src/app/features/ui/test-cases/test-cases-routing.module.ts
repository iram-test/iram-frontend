import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';

const routes: Routes = [
  {
    path: 'test-cases',
    component: TestCasesComponent
  },
  {
    path: 'add-test-case',
    component: AddTestCaseComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TestCasesRoutingModule { }
