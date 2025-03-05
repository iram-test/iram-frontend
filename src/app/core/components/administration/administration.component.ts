import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.less'
})
export class AdministrationComponent {
  administrationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.administrationForm = this.fb.group({
      passwd: ['', Validators.required],
      repeatPasswd: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.administrationForm.value);
  }

  onCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route }); // Повернення до списку
  }
}
