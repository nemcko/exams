import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../../shared/services';
import * as textdata from './exam-users.component.json';
import * as users from '../../user/users.json';
import * as panelbuttons from '../../panelbuttons.json';

import { ApiModel } from '../../shared/api.model';
import { ExaCtrl } from '../core/ctrldef';
import { ExamComponent } from '../core/ctrl.component';
import { UsrBasicDataComponent } from '../../user/usrlist/usr-basic-data.component';

@Component({
  templateUrl: './exam-users.component.html'
})
export class ExamUsersComponent {
  private _id;
  public uuid: string;
  private _refrUuid: string;
  public labels = {};
  public oid = '';
  public access: {};
  public company: ApiModel.IExaCompany;
  public language = '';

  get service(): BrwService {
    return this._service;
  }

  protected field: string;
  protected ctrl: ExamComponent;
  protected cardCtrl: ExaCtrl;

  private _parentId: string = '';
  @Input()
  set parentId(val: string) {
    this._parentId = val;
  }
  get parentId(): string {
    return this._parentId;
  }

  protected parentQparams: any;

  protected get qparams() {
    return { commandId: 'users', clientId: this.ctrl.data.id, viewstate: this.ctrl.viewstate, field: this.field, language: this.language };
  }




  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
    private _modalService: NgbModal,
  ) {
    this.labels = texts.toObject([users, textdata, panelbuttons], _user.lng);
    this.access = _user.getAccess();

    this.oid = 'examdials';
    this.uuid = this._refrUuid = this._service.getUUID('examdials%users');
    this._service.register(this, this.uuid);
  }

  public setParent(field: string, ctrl: ExamComponent, card: ExaCtrl, company: ApiModel.IExaCompany, qparam: any) {
    this.field = field;
    this.ctrl = ctrl;
    this.cardCtrl = card;
    this.company = company;
    this.parentQparams = qparam;


    if (this.cardCtrl && this.cardCtrl['controls'] && this.cardCtrl['controls']['lng']) {
      this.language=this.cardCtrl['controls']['lng'].value;
    } else if (this.ctrl) {
      this.language=this.ctrl.data.lng;
    }

  }

  protected addItem(item) {
    let user: ApiModel.IExaUser = {
      usr: item.usr,
      firstname: item.firstname,
      lastname: item.lastname,
      faceid: item.id,
    }

    this.cardCtrl['controls'][this.field].patchValue(user, { onlySelf: true, emitEvent: true });
    this.activeModal.close('Close click');
  }

  protected appendItem() {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(UsrBasicDataComponent, { size: 'lg' });
      modalRef.componentInstance.lodaData('', this, this._refrUuid);
    }
  }

}
