import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../shared/services';
import * as textdata from './flyoffice-list.component.json';
import * as address from '../user/addresses.json';
import * as panelbuttons from '../panelbuttons.json';

@Component({
  selector: 'flyaddr',
  templateUrl: './add-address.component.html'
})
export class AddFlyAddressComponent {
  private _id;
  public uuid: string;
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
    return { commandId: 'alist', clientId: this._parentId };
  }




  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
  ) {
    this.labels = texts.toObject([textdata, address, panelbuttons], _user.lng);
    this.access = _user.getAccess();

    this.oid = 'address';
    this.uuid = this._service.getUUID('address%add');
    this._service.register(this, this.uuid);
  }

  public setParentData(parent: any) {
    // this.parentOid = poid;
    // this.parentId = pid;
    // this.parentQparams = qparam;
  }

  protected setAddress(item) {
    this.activeModal.close(item);
  }
}
