import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user';
import { BrwService, TextsService, IBrwRow } from '../shared/services';
import * as textdata from './client-list.component.json';
import * as clients from '../user/clients.json';
import * as panelbuttons from '../panelbuttons.json';

import { ClientDetailComponent } from './client-detail.component';
import { AddUserComponent } from './add-user.component';
import { AddAddressComponent } from './add-address.component';

@Component({
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnDestroy {
  private _onLngChng: Subscription;
  private _lngSub: Subscription;
  protected panelType: string = 'btnClients';
  protected panelWidth = { left: 100, right: 0 };

  public labels = {};
  public oid = 'client';
  public uuid: string;
  public access = {};


  get service(): BrwService {
    return this._service;
  }

  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    private _modalConfig: NgbModalConfig,
    private _modalService: NgbModal,
  ) {
    let textlib = [textdata, clients, panelbuttons];
    this._modalConfig.backdrop = false; this._modalConfig.keyboard = false;
    this.labels = texts.toObject(textlib, _user.lng);
    this.access = _user.getAccess();
    this.uuid = this._service.getUUID(this.oid);
    _service.register(this, this.uuid);

    this._lngSub = this._onLngChng = this._user.getLngChng().subscribe(lng => {
      this.labels = this.texts.toObject(textlib, lng);
      _service.doLngChng(lng);
    });
  }

  ngOnDestroy() {
    if (this._lngSub) this._lngSub.unsubscribe();
  }

  rowClick(rowEvent) {
  }

  rowDoubleClick(rowEvent) {
    this.showDetail(rowEvent.row.id);
  }

  public parentId: string;
  public rowChanged(lastrow: IBrwRow) {
    this.parentId = (lastrow.row ? lastrow.row.id : undefined);
    this.qparam = {
      'clientId': this.parentId
    }
  }


  public poid: string = '';
  public qparam: any;


  public showDetail(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(ClientDetailComponent);
      modalRef.componentInstance.lodaData(id, this);
    }
  }

  public selectPanelType(type?: string) {
    this.panelType = type;
    switch (type) {
      case 'btnUsers':
        this.panelWidth = { left: 60, right: 40 };
        this.poid = 'usradr';
        break;
      case 'btnAddresses':
        this.panelWidth = { left: 60, right: 40 };
        this.poid = 'cliadrs';
        break;
      default:
        this.panelType = 'btnClients'
        this.panelWidth = { left: 100, right: 0 };
        this.poid = this.oid;
    }
  }

  public addUserAddress() {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(AddUserComponent);
      modalRef.componentInstance.setParent(this.poid, this.parentId, this.qparam);
    }
  }

  public addClientAddress() {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(AddAddressComponent);
      modalRef.componentInstance.setParent(this.poid, this.parentId, this.qparam);
    }
  }

}
