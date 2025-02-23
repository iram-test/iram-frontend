import { Component } from '@angular/core';
import { PopupService } from '../../../core/services/popup.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { RegisterDTO } from '../../../core/models/auth-dto'; // Import RegisterDTO
import { HttpErrorResponse } from '@angular/common/http';
import { UserRole } from '../../../core/models/enums/user-role';

interface AuthResponseDto {
  isAuthSuccessful: boolean;
  token: string;
  errorMessage?: string;
  is2StepVerificationRequired?: boolean;
  provider?: string;
}

@Component({
  selector: 'app-register-user',
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string;
  showError: boolean = false;
  userRoles = Object.values(UserRole).filter(value => typeof value === 'string');

  constructor(public popupService: PopupService, public router: Router, private readonly authService: AuthenticationService,
              private readonly fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.USER, [Validators.required]]
    });
  }

  register(): void {
    this.showError = false;
    if (this.registerForm.invalid) {
      return;
    }

    const registerDto: RegisterDTO = this.registerForm.value;

    this.authService.registerUser(registerDto).subscribe({
      next: (response: AuthResponseDto) => {
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        console.log(this.errorMessage);
        this.showError = true;
      }
    });
  }

  closeRegister() {
    this.popupService.toggleRegister();
  }

  openLogin() {
    this.closeRegister();
    this.popupService.toggleLogin();
    this.router.navigate(['/login']);
  }
}