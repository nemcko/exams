import { Component, Input } from '@angular/core';

@Component({
  selector: 'frmfld-label',
  template: `
  <div class="form-group {{cls}}">
  <label
    [for]="id"
    [ngClass]="{ 'required': isRequired }">{{label}}</label>
    <ng-content></ng-content>
  </div>
  `, styles: [`:host {  width: 100%; }`]

})
export class FldLabeledComponent {
  @Input() cls: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() isRequired: boolean = false;
}
