import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private showLogin = false; 
  private showRegister = false;
  
  constructor() { } 
  
  toggleLogin() { 
    this.showLogin = !this.showLogin; 
  }
  
  isLoginVisible() { 
    return this.showLogin; 
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  isRegisterVisible() {
    return this.showRegister;
  }
}
