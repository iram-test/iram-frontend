import { Component, forwardRef, ElementRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-contenteditable',
  template: `<div #editableContent contenteditable="true" (input)="onInput($event)" [innerHTML]="value"></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableComponent),
      multi: true
    }
  ]
})
export class ContenteditableComponent implements ControlValueAccessor, OnInit {
  @Input() value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.querySelector('[contenteditable]').innerHTML = this.value;
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLElement;
    const value = inputElement.innerHTML;
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.value = value;
    this.el.nativeElement.querySelector('[contenteditable]').innerHTML = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
