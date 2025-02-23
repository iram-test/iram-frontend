import { Component } from '@angular/core';
import { PopupService } from '../../../core/services/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { LoginWithUsernameDTO, LoginWithEmailDTO } from '../../../core/models/auth-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResult } from '../../../core/models/AuthResult';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  private returnUrl: string;

  loginForm: FormGroup;
  errorMessage: string;
  showError: boolean = false;

  constructor(private readonly authService: AuthenticationService,
              private readonly fb: FormBuilder,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              public popupService: PopupService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(data: any): void {
    this.showError = false;
    if (this.loginForm.invalid) {
      return;
    }

    const loginDto: LoginWithEmailDTO = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.loginUserWithEmail(loginDto).subscribe({
      next: (response: AuthResult) => {
        localStorage.setItem("token", response.refreshToken);
        // this.authService.sendAuthStateChangeNotification(response.isAuthSuccessful);
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.showError = true;
      }
    });
  }

  closeLogin() {
    this.popupService.toggleLogin();
  }

  openRegister() {
    this.closeLogin();
    this.popupService.toggleRegister();
    this.router.navigate(['/register']);
  }
}