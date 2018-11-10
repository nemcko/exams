import {  Component,  Input} from '@angular/core';

@Component({
  selector: 'frmfld',
  template: `
  <frmfld-label
    [cls]="cls"
    [label]="label"
    [id]="id"
    [isRequired]="isRequired">
    <frmfld-input
      #input
      [(ngModel)]="value"
      [type]="type"
      [id]="id"
      [placeholder]="placeholder"></frmfld-input>
  </frmfld-label>
  `
})
export class FrmfldComponent {
  @Input() cls: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() id: string = '';
  @Input() isRequired: boolean = false;
}
