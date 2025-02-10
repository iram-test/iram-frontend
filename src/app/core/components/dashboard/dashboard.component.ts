import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent {
  constructor(private readonly router: Router) { }
  addProject() {
    this.router.navigate(['/add-project']);
  }
}
