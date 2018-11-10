import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../shared/services';
import * as textdata from './address-list.component.json';
import * as users from '../user/users.json';
import * as panelbuttons from '../panelbuttons.json';

import { UsrBasicDataComponent } from '../user/usrlist/usr-basic-data.component';

@Component({
  selector: 'add',
  templateUrl: './add-user-address.component.html'
})
export class AddUserAddressComponent {
  private _id;
  public uuid: string;
  private _refrUuid: string;
  public labels = {};
  public oid = '';
  public access: {};

  get service(): BrwService {
    return this._service;
  }

  protected parentOid: string;

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
    return { commandId: 'alist', addressId: this._parentId };
  }




  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
    private _modalService: NgbModal,
  ) {
    this.labels = texts.toObject([textdata, users, panelbuttons], _user.lng);
    this.access = _user.getAccess();

    this.oid = 'usradr';
    this.uuid = this._refrUuid = this._service.getUUID('usradr%add');
    this._service.register(this, this.uuid);
  }

  public setParent(poid: string, pid: string, qparam: any) {
    this.parentOid = poid;
    this.parentId = pid;
    this.parentQparams = qparam;
  }

  protected addItem(item) {
    if (this.access['adm']) {
      let exepar = <ICrudExec>{};
      exepar.uuid = this._refrUuid;
      exepar.oid = this.oid;
      exepar.cid = 'add';
      exepar.payload = { userid: item.usr };
      exepar.qparams = this.parentQparams;

      let viewpar = <ICrudCmd>{};
      viewpar.uuid = this._service.getUUID('usradr');
      viewpar.oid = this.oid;
      viewpar.cid = 'list';
      viewpar.qparams = this.qparams;

      this._service.doExec(exepar, viewpar);
    }
  }

  protected appendItem() {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(UsrBasicDataComponent);
      modalRef.componentInstance.lodaData('', this,this._refrUuid);
    }
  }

}
