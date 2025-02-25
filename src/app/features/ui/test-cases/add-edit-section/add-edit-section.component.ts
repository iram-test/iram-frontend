import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-section',
  templateUrl: './add-edit-section.component.html',
  styleUrl: './add-edit-section.component.less'
})
export class AddEditSectionComponent {
  sectionForm: FormGroup;
  id: number = 0;

  constructor(private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.id = Number.parseInt(this.route.snapshot.params['id']);

    this.sectionForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    if (this.id) {
      localStorage.getItem(this.id.toString());
    }
  }

  public sendData(data: any): void {
    if (!this.id)
      this.createSection(data);
    else
      this.editSection(data);

    this.router.navigate([`/dashboard`]);
  }

  private createSection(data: any): void {
    this.id++;
    console.log(this.id);
    let section = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(section));
  }

  private editSection(data: any): void {
    let section = { id: this.id, ...data };
    localStorage.setItem(this.id.toString(), JSON.stringify(section));
  }
}
