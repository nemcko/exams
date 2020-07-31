import { Component, Input } from '@angular/core';

@Component({
  selector: '[frmfbtn]',
  template: `
    <label>{{labels[id]}}</label>
    <button type="button" class="btn btn-outline-secondary fbtn w-100 text-left py-1 pl-1" [disabled]="readonly">
      <face [uid]="faceid" [size]="24" [cls]="'d-inline-block'"></face>
      <ng-content></ng-content>
    </button>
  `,styles: [`:host {max-width: 100% !important; }`],
})
export class FrmFaceButtonComponent {
  @Input() labels: any;
  @Input() id: string = '';
  @Input() faceid: string = '';
  @Input() readonly: boolean = false;
}

