import { Component } from '@angular/core';

@Component({
  selector: 'app-select-cases',
  templateUrl: './select-cases.component.html',
  styleUrl: './select-cases.component.less'
})
export class SelectCasesComponent {
  items = [
    { text: 'Title', checked: false },
    { text: 'Check filter titles', checked: true },
    { text: 'Check filtering by seller', checked: true },
    { text: 'Check price filtering - positive test', checked: true },
    { text: 'Enter letters into the price fields in the price....', checked: true },
    { text: 'Filter product by price using symbols', checked: false }
  ];

  toggleItem(index: number) {
    this.items[index].checked = !this.items[index].checked;
  }

  navigateAddTestRun() {
    
  }
}
