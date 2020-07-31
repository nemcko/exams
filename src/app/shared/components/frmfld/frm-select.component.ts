import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';

@Component({
  selector: '[frmselect]',
  template: `
  <label>{{labels[id]}}</label>
  <ng-content></ng-content>
`, styles: [`:host {max-width: 100% !important; }`],
})
export class FrmSelectComponent {
  @Input() labels: any;
  @Input() id: string = 'XXX';
  @Input() fld: AbstractControl;
  @Input() readonly: boolean = false;

  // ngOnInit() {
  //   if (this.readonly) {
  //     // this.fld.get('state').reset();
  //     this.fld.get('state').enable();
  //   } else {
  //     // this.fld.get('state').reset();
  //     this.fld.get('state').disable();
  //   }
  // }
}


// <label>{{labels[id]}}</label>
// <div class="d-flex w-100">
//   <select [formControlName]="id" class="form-control">
//     <ng-content></ng-content>
//   </select>
// </div>


// <label [for]="id">{{labels[id]}}</label>
// <ng-select 
//   [items]="items"
//   bindLabel="bindLabel"
//   bindValue="bindValue"
//   labelForId="id"
//   [multiple]="multiple"
//   placeholder="labels[id]"
//   clearAllText="Clear"
//   formControlName="ctrl"
// ></ng-select>  
