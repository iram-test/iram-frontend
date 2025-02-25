import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrl: './add-edit-project.component.less'
})
export class AddEditProjectComponent {
  projectForm: FormGroup;
  id: number = 0;

  constructor(private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.id = Number.parseInt(this.route.snapshot.params['id']);

    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      announcement: ['']
    });

    if (this.id) {
      localStorage.getItem(this.id.toString());
    }
  }

  public sendData(data: any): void {
    if (!this.id)
      this.createProject(data);
    else
      this.editProject(data);

    this.router.navigate([`/dashboard`]);
  }

  private createProject(data: any): void {
    this.id++;
    console.log(this.id);
    let project = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(project));
  }

  private editProject(data: any): void {
    let project = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(project));
  }
}
