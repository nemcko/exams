import { Component, Input } from '@angular/core';

@Component({
  selector: '[frmface]',
  template: `
    <label>{{labels[id]}}</label>
    <div class="d-flex w-100">
      <face [uid]="faceid" [size]="32" [cls]="'d-inline'" [readonly]="readonly"></face>
      <div class="flex-grow-1 p-1">
        <ng-content></ng-content>
      </div>
    </div>
  `,styles: [`:host {max-width: 100% !important; }`],
})
export class FrmFaceComponent {
  @Input() labels: any;
  @Input() id: string = '';
  @Input() faceid: string = '';
  @Input() readonly: boolean = false;
}
