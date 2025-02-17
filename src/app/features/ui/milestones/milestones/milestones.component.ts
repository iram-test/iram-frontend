import { Component, OnInit } from '@angular/core';
import { Milestone } from '../../../../core/models/milestone-entity';
import { HttpClient } from '@angular/common/http';
import { MilestoneStatus } from '../../../../core/models/enums/milestone-status';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrl: './milestones.component.less'
})
export class MilestonesComponent implements OnInit {
  milestones: Milestone[];


  constructor(private readonly http: HttpClient) { }

  isMilestonesEmpty() {
    return this.milestones.length === 0;
  }

  ngOnInit(): void {
    //Later here will be logic with httpClient
    const milestone: Milestone = {
      name: 'Hello My Milestone',
      milestoneID: '',
      parentId: '',
      description: '',
      startDate: new Date().toString(),
      endDate: new Date(2025, 3, 10).toString(),
      status: MilestoneStatus.OPEN,
      createdAt: undefined,
      updatedAt: undefined,
      projectId: '',
      testReportId: '',
      testRunId: ''
    };
    this.milestones = [milestone];
    // this.milestones = [];
  }
}
