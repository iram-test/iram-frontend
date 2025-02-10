import { Component } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.less'
})
export class LandingPageComponent {
  constructor(public popupService: PopupService, private router: Router) { }

  openLoginPopup() {
    this.popupService.toggleLogin();
    if (this.popupService.isLoginVisible()) {
      this.router.navigate(['/login']);
    }
  }

  openRegisterPopup() {
    this.popupService.toggleRegister();
    if (this.popupService.isRegisterVisible()) {
      this.router.navigate(['/register']);
    }
  }

  state = 0;
  toggleTestManagementBtnStyles() {
    const chart1 = document.querySelector(".images>img:nth-child(1)");
    const chart2 = document.querySelector(".images>img:nth-child(2)");
    const testManagementButton = document.querySelector(".flx>div:nth-child(1)");
    const analyticsButton = document.querySelector(".flx>div:nth-child(2)");
    if (this.state == 0) {
      testManagementButton?.classList.remove("current");
      testManagementButton?.classList.add("inactive");
      analyticsButton?.classList.remove("inactive");
      analyticsButton?.classList.add("current");

      chart1?.classList.add("inactive-img");
      chart2?.classList.remove("inactive-img");
      this.state = 1;
    }
    else {
      testManagementButton?.classList.remove("inactive");
      testManagementButton?.classList.add("current");
      analyticsButton?.classList.remove("current");
      analyticsButton?.classList.add("inactive");

      chart1?.classList.remove("inactive-img");
      chart2?.classList.add("inactive-img");
      this.state = 0;
    }
  }
}
