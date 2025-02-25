import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-subsection',
  templateUrl: './add-edit-subsection.component.html',
  styleUrl: './add-edit-subsection.component.less'
})
export class AddEditSubsectionComponent {

  subSectionForm: FormGroup;
  id: number = 0;

  constructor(private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.id = Number.parseInt(this.route.snapshot.params['id']);

    this.subSectionForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    if (this.id) {
      localStorage.getItem(this.id.toString());
    }
  }

  public sendData(data: any): void {
    if (!this.id)
      this.createSubsection(data);
    else
      this.editSubsection(data);

    this.router.navigate([`/dashboard`]);
  }

  private createSubsection(data: any): void {
    this.id++;
    console.log(this.id);
    let subSection = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(subSection));
  }

  private editSubsection(data: any): void {
    let subSection = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(subSection));
  }
}
