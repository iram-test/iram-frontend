import { Component, OnInit } from '@angular/core';
import { Milestone } from '../../../../core/models/milestone-entity';
import { MilestoneService } from '../../../../core/services/milestone.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrl: './milestones.component.less'
})
export class MilestonesComponent implements OnInit {
  milestones: Milestone[] = [];
  filteredMilestones: Milestone[] = [];
  loading = false;
  errorMessage: string | null = null;
  projectId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private milestoneService: MilestoneService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      if (this.projectId) {
        this.loadMilestones();
      } else {
        this.errorMessage = "Project ID is required.";
      }
    });
  }

  isMilestonesEmpty() {
    return this.milestones.length === 0;
  }

  navigateEditMilestone(id: string) {
    this.router.navigate(['edit-milestone', id], { relativeTo: this.route })
  }

  loadMilestones() {
    if (!this.projectId) return;
    this.loading = true;
    this.milestoneService.getMilestonesByProjectId(this.projectId)
      .pipe(
        catchError(err => {
          this.errorMessage = err.message || 'Failed to load milestones';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe(milestones => {
        this.milestones = milestones;
        this.filteredMilestones = [...this.milestones];
        this.loading = false;
      });
  }

  navigateAddMilestone() {
    this.router.navigate(['add-milestone'], { relativeTo: this.route });
  }

  filterMilestones(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.filteredMilestones = this.milestones.filter(milestone =>
      milestone.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  onDeleteMilestone(milestone: Milestone) {
    if (!milestone || !milestone.milestoneId) {
      console.error('Milestone or Milestone ID is undefined. Cannot delete.');
      return;
    }

    this.deleteMilestone(milestone.milestoneId);
  }

  deleteMilestone(milestoneId: string) {
    this.milestoneService.deleteMilestone(milestoneId).subscribe({
      next: () => {
        console.log('Milestone deleted successfully');
        this.loadMilestones(); // Refresh the list after deletion
      },
      error: error => {
        console.error('Error deleting milestone', error);
        // Optionally display an error message to the user
      }
    });
  }
}
