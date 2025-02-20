import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../../core/services/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { User } from '../../../core/models/user-entity';
import { UserRole } from '../../../core/models/enums/user-role';
import { HttpErrorResponse } from '@angular/common/http';

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
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(data: any): void {
    this.showError = false;
    let login = { ...data };
    const userForAuth: User = new User(login.email, login.password);

    this.authService.loginUser('/login', userForAuth).subscribe({
      next: (response: AuthResponseDto) => {
        // if (response.is2StepVerificationRequired) {
        //   this.router.navigate(['/authentication/twostepverification'], { queryParams: { returnUrl: this.returnUrl, provider: response.provider, email: userForAuth.email } });
        // }
        // else {
          localStorage.setItem("token", response.token);
          this.authService.sendAuthStateChangeNotification(response.isAuthSuccessful);
          this.router.navigate([this.returnUrl]);
        // }
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
