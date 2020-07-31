import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user';
import { BrwService, TextsService, IBrwRow } from '../shared/services';
import * as textdata from './examed-list.component.json';
import * as panelbuttons from '../panelbuttons.json';

import { ExamedDetailComponent } from './examed-detail.component';


@Component({
  selector: 'examed-list',
  templateUrl: './examed-list.component.html',
  styles: []
})
export class ExamedListComponent implements OnDestroy {
  private _onLngChng: Subscription;
  private _lngSub: Subscription;

  public labels = {};
  public oid = 'examed';
  public uuid: string;
  public access = {};

  public panelWidth = { left: 100, right: 0 };

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
    let textlib = [textdata, panelbuttons];
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

  public doctype: string;
  public parentId: string;
  public rowChanged(lastrow: IBrwRow) {
    this.parentId = (lastrow.row ? lastrow.row.id : undefined);
    this.qparam = {
      'examedid': this.parentId,
      'type': this.doctype
    }
  }

  public refresh(){
    this._service.doRefresh(this.oid, this.uuid, {
      'examedid': this.parentId,
      'type': this.doctype
    });
  }


  public qparam: any;

  public setExaFilter(evnt, ftype) {
    this.doctype = ftype;
    this.refresh();
  }

  public showDetail(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(ExamedDetailComponent);
      modalRef.componentInstance.lodaData(id, this);
    }
  }

}
