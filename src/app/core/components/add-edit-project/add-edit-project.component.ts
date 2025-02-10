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
      // this.projectService.getById(this.id).subscribe(result => {
      //   this.projectForm.patchValue(result);
      // },
      //   error => console.error(error));
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

    // let meter = { ...data, docPath: this.response.dbPath };
    // this.meterService.add(meter).subscribe(result => console.log(result),
    //   error => console.error(error));
  }

  private editProject(data: any): void {
    let project = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(project));
    // let meter = { id: this.id, docPath: this.response.dbPath, ...data };
    // this.meterService.update(this.id, meter).subscribe(result => console.log(result),
    //   error => console.error(error));
  }
}
