import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: '[frmcheckbox]',
  template: `
  <div class="custom-control custom-checkbox">
    <ng-content></ng-content>
    <label class="custom-control-label" [for]="id">{{labels[id]}}</label>
  </div>
  `
})
export class FrmCheckgoxComponent {
  @Input() labels: any;
  @Input() id: string = '';
  @Input() fld: AbstractControl;
}
