import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from './features/authentication/login/login.component';
import { PopupService } from './core/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'Iram';
  constructor(public popupService: PopupService, private router: Router) {}

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
}
