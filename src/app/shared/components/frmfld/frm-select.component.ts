import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';

@Component({
  selector: 'frmselect',
  template: `
  <label [for]="id">{{labels[id]}}xxx</label>
  `
})
export class FrmSelectComponent {
  @Input() labels: any;
  @Input() id: string = '';
}
