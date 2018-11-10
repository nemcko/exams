import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
declare let $: any;

import { UserService } from '../../user';
import { BrwService, TextsService, ICrudCmd, IBrwRow } from '../../shared/services';
import * as textdata from './usrlist.component.json';
import * as examinators from '../examinators.json';
import * as users from '../../user/users.json';
import * as clients from '../../user/clients.json';
import * as panelbuttons from '../../panelbuttons.json';

import { UsrDocumentComponent } from './usr-document.component';

@Component({
  selector: 'userdocs',
  template: `
<div class="text-primary px-1 h5 mt-1">{{labels.titleDocuments}} ({{parentId}}) </div>
<brw [uuid]="uuid" [oid]="oid"  [service]="service" [qparams]="qparams" (rowDoubleClick)="rowDoubleClick($event)">
  <brwcol [name]="'type'" [header]="labels.type" [width]="15"></brwcol>
  <brwcol [name]="'name'" [header]="labels.name" [width]="45"></brwcol>
  <brwcol [name]="'dafr'" [header]="labels.dafr" [width]="20"></brwcol>
  <brwcol [name]="'dato'" [header]="labels.dato" [width]="20"></brwcol>
  <brwcol [name]="'id'" [width]="'28px'" [cls]="'p-0 float-right'" [visible]="access.adm">
    <ng-template #dataTableCell let-item="row">
      <button type="button" class="btn btn-outline-secondary btn-sm" (click)="showExamLangData(item.id)">
        <span [class]="'fa fa-pencil'"></span>
      </button>
    </ng-template>
  </brwcol>
</brw>
`
})
export class UsrDocumentsComponent implements AfterViewInit, OnDestroy {
  private _uuid: string;
  private _oid: string;
  private _onLngChng: Subscription;
  private _lngSub: Subscription;
  private _subscribe: Subscription;

  public labels = {};
  public access = {};

  @Input()
  get oid(): string { return this._oid; }
  set oid(val: string) {
    this._oid = val;
    this._uuid = this._service.getUUID(val);
  };

  get uuid(): string { return this._uuid; }

  @Input() poid: string;

  get service(): BrwService {
    return this._service;
  }

  private _parentId: string = '';
  @Input()
  set parentId(val: string) {
    this._parentId = val;
  }
  get parentId(): string {
    return this._parentId;
  }

  protected get qparams() {
    return { commandId: 'users', userId: this._parentId, 'examtype': this.examtype, rowId: this.rowId };
  }

  @Input() examtype: string;
  @Input() rowId: string;


  constructor(
    private _service: BrwService,
    private _texts: TextsService,
    private _user: UserService,
    private _modalService: NgbModal,
  ) {
    let textlib = [users, clients, textdata, panelbuttons];
    this.labels = _texts.toObject(textlib, _user.lng);
    this.access = _user.getAccess();

    this._lngSub = this._onLngChng = this._user.getLngChng().subscribe(lng => {
      this.labels = this._texts.toObject(textlib, lng);
    });

    this.oid = 'usrdoc';
    this._service.register(this, this._service.getUUID(this.oid));
  }

  ngAfterViewInit() {
    this._subscribe = this._service.onCommand$.subscribe(cmd => {
      if (cmd.cid == '#rowchanged' && cmd.oid == this.poid) {
        this.parentId = (cmd.row ? cmd.row.usr : null);
        this._service.refresh(this._uuid, this.qparams);
      }
    })
  }

  rowDoubleClick(rowEvent) {
    this.showExamLangData(rowEvent.row.id);
  }

  public showExamLangData(id) {
    const modalRef = this._modalService.open(UsrDocumentComponent);
    modalRef.componentInstance.lodaData(id, this);
  }

  ngOnDestroy() {
    if (this._subscribe) this._subscribe.unsubscribe();
    if (this._lngSub) this._lngSub.unsubscribe();
  }

}
