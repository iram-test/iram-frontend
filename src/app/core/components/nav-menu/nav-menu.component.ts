import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../services/authentication.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.less'
})
export class NavMenuComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  authSubscription: Subscription;
  constructor(public popupService: PopupService,
    public router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isUserAuthenticated();
    this.authSubscription = this.authService.authChanged.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    )
  }

  openLoginPopup() {
    this.popupService.toggleLogin();
    if (this.popupService.isLoginVisible()) {
      this.router.navigate(['/login']);
    }
  }
  logout() {
    this.authService.logoutUser().subscribe({
      next: () => {
        localStorage.removeItem("token");
        this.authService.sendAuthStateChangeNotification(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
