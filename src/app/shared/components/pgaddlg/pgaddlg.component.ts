import { Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pgaddlg',
  template: `
<div class="modal-content shadow-lg">
  <div class="modal-header pb-1">
    <h4 class="modal-title">{{title}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body pt-0 pb-4">
    <div class="border border-primary rounded p-2">
    <ng-content></ng-content>
    </div>
  </div>
</div>
  `
})
export class PgaddlgComponent {
  @Input() title: string = '';

  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }

}
