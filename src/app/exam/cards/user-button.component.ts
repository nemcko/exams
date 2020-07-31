import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

import { ApiModel } from '../../shared/api.model';
import { ExamComponent } from '../core/ctrl.component';
import { ExamUsersComponent } from '../dials/exam-users.component';

@Component({
  selector: '[userbtn]',
  template: `
    <label>{{labels[id]}}</label>
    <div *ngIf="readonly" class="d-flex w-100">
      <face [uid]="userFace" [size]="32" [cls]="'d-inline'" [readonly]="readonly"></face>
      <div class="flex-grow-1 p-1">
      {{userFullName}}
      </div>
    </div>
    <button *ngIf="!readonly" type="button" class="btn btn-outline-secondary fbtn w-100 text-left py-1 pl-1"
     [ngClass]="{ 'btn-outline-danger': !frm.getRawValue()[id].usr }"
      [disabled]="readonly" (click)="showUsers($event)">
      <face [uid]="userFace" [size]="24" [cls]="'d-inline-block'"></face>
      {{userFullName}}
    </button>
  `, styles: [`:host {max-width: 100% !important; }`],
})
export class UserButtonComponent {
  @Input() labels: any;
  @Input() id: string = '';
  @Input() frm: FormGroup;
  @Input() readonly: boolean = false;
  @Input() usrobj: ApiModel.IExaUser = { usr: '' };
  @Input() company: ApiModel.IExaCompany;
  @Input() ctrl: ExamComponent;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
  }

  public get userFullName(): string {
    let name = '';
    if (this.frm && this.frm.controls) {
      if (this.frm.controls[this.id] && this.frm.controls[this.id].value)
        name = `${this.frm.controls[this.id].value['firstname']} ${this.frm.controls[this.id].value['lastname']}`;
    } else
      if (this.usrobj.usr) {
        name = `${this.usrobj['firstname']} ${this.usrobj['lastname']}`;
      }
    return name;
  }

  public get userFace(): string {
    if (this.frm && this.frm.controls) {
      if (this.frm.controls[this.id] && this.frm.controls[this.id].value)
        return this.frm.controls[this.id].value['faceid'];
      else
        return '';
    } else
      if (this.usrobj.usr) {
        return this.usrobj['faceid'];
      }
      else {
        return '';
      }
  }

  public showUsers(event) {
    if (this.readonly) return;
    const self = this;
    const modalRef = this.modalService.open(ExamUsersComponent);
    modalRef.componentInstance.setParent(self.id, self.ctrl, (self.frm ? self.frm : self.usrobj), self.company, '');
  }


}

