import { Component } from '@angular/core';
import { PopupService } from '../../../core/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  constructor(public popupService: PopupService, public router: Router) { }
  
  closeRegister() {
    this.popupService.toggleRegister();
  }

  openLogin() {
    this.closeRegister();
    this.popupService.toggleLogin();
    this.router.navigate(['/login']);
  }
}
