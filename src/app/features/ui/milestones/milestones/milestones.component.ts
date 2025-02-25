import { Component, OnInit } from '@angular/core';
import { Milestone } from '../../../../core/models/milestone-entity';
import { HttpClient } from '@angular/common/http';
import { MilestoneStatus } from '../../../../core/models/enums/milestone-status';
import { Router } from '@angular/router';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrl: './milestones.component.less'
})
export class MilestonesComponent implements OnInit {
  milestones: Milestone[];
  filteredMilestones: Milestone[];


  constructor(private readonly http: HttpClient, private router: Router) { }

  isMilestonesEmpty() {
    return this.milestones.length === 0;
  }

  ngOnInit(): void {
    //Later here will be logic with httpClient
    const milestone1: Milestone = {
      name: 'Hello My Milestone',
      milestoneID: 'asjkldsadjlkasjlkdsajlkdsaadsjkjklkajkieu8218392s',
      parentId: '',
      description: '',
      startDate: new Date().toISOString(),
      endDate: new Date(2025, 3, 10).toISOString(),
      status: MilestoneStatus.OPEN,
      createdAt: undefined,
      updatedAt: undefined,
      projectId: '',
      testReportId: '',
      testRunId: ''
    };

    const milestone2: Milestone = {
      name: 'Milestone 2',
      milestoneID: 'asjkldsadjlkasjlkdsajlkdsaadsjkjkl',
      parentId: '',
      description: '',
      startDate: new Date().toISOString(),
      endDate: new Date(2025, 3, 10).toISOString(),
      status: MilestoneStatus.OPEN,
      createdAt: undefined,
      updatedAt: undefined,
      projectId: '',
      testReportId: '',
      testRunId: ''
    }
    this.milestones = [milestone1, milestone2];
    // this.milestones = [];
    this.filteredMilestones = [...this.milestones];
  }

  navigateAddMilestone() {
    this.router.navigate(['/add-milestone']);
  }

  filterMilestones(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    // console.log(searchText);
    this.filteredMilestones = this.milestones.filter(milestone =>
      milestone.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  removeMilestone(id: string) {
    this.milestones = this.milestones.filter(ms => ms.milestoneID !== id);
    this.filteredMilestones = this.milestones;
  }
}
