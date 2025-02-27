import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-internal-menu',
  templateUrl: './internal-menu.component.html',
  styleUrl: './internal-menu.component.less'
})
export class InternalMenuComponent implements OnInit, OnDestroy {

  projectId: string | null = null;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
