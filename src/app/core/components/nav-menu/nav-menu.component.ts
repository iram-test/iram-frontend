import { Component } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.less'
})
export class NavMenuComponent {
  constructor(public popupService: PopupService, public router: Router) { }

  openLoginPopup() {
    this.popupService.toggleLogin();
    if (this.popupService.isLoginVisible()) {
      this.router.navigate(['/login']);
    }
  }
}
