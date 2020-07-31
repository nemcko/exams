import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: '[frminput]',
  template: `
  <label [for]="id">{{labels[id]}}</label>
  <ng-content></ng-content>
  <frmerrors [fld]="fld" [labels]="labels"></frmerrors>
  `
})
export class FrmInputComponent {
  @Input() labels: any;
  @Input() id: string = '';
  @Input() fld: AbstractControl;
}
