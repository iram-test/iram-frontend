import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenteditableComponent } from './contenteditable/contenteditable.component';



@NgModule({
  declarations: [ContenteditableComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ContenteditableComponent
  ]
})
export class SharedModule { }
