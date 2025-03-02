import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestCaseDTO } from '../../models/test-case-dto';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.less'
})
export class ProjectDetailsComponent {
  testCases: TestCaseDTO[];
  filteredTestCases: TestCaseDTO[];

  constructor(private readonly http: HttpClient) {
    console.log('TestCasesComponent constructor');
  }

  isTestCasesEmpty() {
    console.log('isTestCasesEmpty called', this.testCases);
    return this.testCases.length === 0;
  }

  ngOnInit(): void {
    this.filteredTestCases = [...this.testCases];
    this.testCases = [];
    console.log('TestCases initialized', this.testCases);
  }

  filterCases(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    // console.log(searchText);
    this.filteredTestCases = this.testCases.filter(testCase =>
      testCase.title.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log(this.filteredTestCases);
  }
}
