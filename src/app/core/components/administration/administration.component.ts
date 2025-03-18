import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {UpdateUserDTO} from "../../models/user-dto";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.less']
})
export class AdministrationComponent implements OnInit {
  administrationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      // Якщо користувача немає, можна редіректнути на сторінку логіну
      this.router.navigate(['/login']);
      return;
    }

    // Ініціалізація форми з поточними даними користувача
    this.administrationForm = this.fb.group({
      userId: [{ value: currentUser.userId, disabled: true }],
      email: [{ value: currentUser.email, disabled: true }],
      username: [currentUser.username, Validators.required],
      passwd: ['', [Validators.required, Validators.minLength(8)]],
      repeatPasswd: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this.checkPasswords });
  }

  // Валідатор для перевірки співпадіння паролів
  checkPasswords(group: AbstractControl): { [key: string]: any } | null {
    const pass = group.get('passwd')?.value;
    const confirmPass = group.get('repeatPasswd')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.administrationForm.invalid) {
      return;
    }
    // getRawValue() повертає значення навіть з disabled-полів
    const formValues = this.administrationForm.getRawValue();

    // Підготовка DTO для оновлення користувача
    const updateUser: UpdateUserDTO = {
      userId: formValues.userId,
      username: formValues.username,
      email: formValues.email,
      password: formValues.passwd
    };

    // Виклик бекенд-сервісу для оновлення даних користувача
    this.userService.updateUser(formValues.userId, updateUser).subscribe({
      next: (res) => {
        // За потреби можна оновити інформацію про поточного користувача в localStorage
        // Редірект на dashboard після успішного оновлення
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  onCancel() {
    // Редірект на dashboard при натисканні "Cancel"
    this.router.navigate(['/dashboard']);
  }
}
