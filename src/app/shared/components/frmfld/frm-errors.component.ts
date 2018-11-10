import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'frmerrors',
  template: `
  <div *ngIf="fld.invalid && (fld.dirty || fld.touched)" class="invalid-feedback">
    <div *ngIf="fld.errors.required">{{labels.errrequired}}</div>
    <div *ngIf="fld.errors.validUrl">{{labels.erruserexist}}</div>
    <div *ngIf="fld.errors.maxlength">{{labels.errmaxlen}}</div>
  </div>
`
})
export class FrmErrorsComponent {
  @Input() labels: any;
  @Input() fld: AbstractControl;
}