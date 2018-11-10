import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { UserService } from '../../../user/user.service';
import { TextsService } from '../../services';
import * as textdata from '../../../panelbuttons.json';


export enum PgAlertType {
  ok = "OK",
  yesno = "YES-NO",
  yesnocancel = "YES-NO-CANCEL",
  savecancel = "SAVE-CANCEL"
}

export enum PgAlertAction {
  ok = "OK",
  yes = "YES",
  no = "NO",
  cancel = "CANCEL",
  save = "SAVE"
}

@Component({
  selector: 'pgalert',
  template: `
  <div class="modal" [id]="dlgid">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content shadow-lg">
            <div class="modal-header pb-2">
                <h4 class="modal-title">{{title}}</h4>
                <button type="button" class="close" aria-label="Close" (click)="doAction('CANCEL')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-3 pt-2">
                    <ng-content></ng-content>
            </div>
            <div class="modal-footer">
              <button *ngIf="type=='OK'" type="button" class="btn btn-primary" (click)="doAction('OK')">{{labels.btnOk}}</button>
              <button *ngIf="type=='YES-NO-CANCEL' || type=='SAVE-CANCEL'" type="button" class="btn btn-secondary" (click)="doAction('CANCEL')">{{labels.btnCancel}}</button>
              <button *ngIf="type=='YES-NO' || type=='YES-NO-CANCEL'" type="button" class="btn btn-secondary" (click)="doAction('NO')">{{labels.btnNo}}</button>
              <button *ngIf="type=='YES-NO' || type=='YES-NO-CANCEL'" type="button" class="btn btn-primary" (click)="doAction('YES')">{{labels.btnYes}}</button>
              <button *ngIf="type=='SAVE-CANCEL'" type="button" class="btn btn-primary" (click)="doAction('SAVE')">{{labels.btnNo}}</button>          
            </div>
        </div>
    </div>
  </div>
  `
})
export class PgalertComponent {
  @Input() dlgid: string = '';
  @Input() dlgRef: HTMLElement;
  @Input() title: string = '';
  @Input() type: PgAlertType = PgAlertType.ok;
  @Input() templateRef: ElementRef;
  @Output() doClick = new EventEmitter<PgAlertAction>();
  public labels = {};

  constructor(
    private _user: UserService,
    private _texts: TextsService,
  ) {
    this.labels = _texts.toObject(textdata, _user.lng);
  }

  doAction(action: PgAlertAction) {
    this.doClick.emit(action);
    $(this.dlgRef).modal('hide');
  }
}
