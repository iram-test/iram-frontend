import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../../core/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  constructor(public popupService: PopupService, public router: Router) { }
  
  closeLogin() {
    this.popupService.toggleLogin();
  }

  openRegister() { 
    this.closeLogin(); 
    this.popupService.toggleRegister(); 
    this.router.navigate(['/register']);
  }
}
