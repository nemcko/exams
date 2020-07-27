import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
declare let $: any;

import { UserService } from '../user';
import { BrwService, TextsService, IBrwRow } from '../shared/services';
import * as textdata from './exasets-list.component.json';
import * as users from '../user/users.json';
import * as clients from '../user/clients.json';
import * as examinators from '../user/examinators.json';
import * as panelbuttons from '../panelbuttons.json';

@Component({
  selector: 'exasetclts',
  template: `
  <div class="text-primary px-1">{{labels.btnClients}}</div>
  <brw [uuid]="uuid" [oid]="oid"  [service]="service" [qparams]="qparams">
  <brwcol [name]="'name'" [header]="labels.name" [width]="30"></brwcol>
  <brwcol [name]="'code'" [header]="labels.code" [width]="5"></brwcol>
  <brwcol [name]="'id'" [width]="'28px'" [cls]="'p-0 float-right'" [visible]="access.adm">
    <ng-template #dataTableCell let-item="row">
      <button type="button" class="btn btn-primary btn-sm" (click)="alertUsrDlg(item)">
        <span [class]="'fa fa-times'"></span>
      </button>
    </ng-template>
  </brwcol>
</brw>
<pgalert [dlgid]="'deleteItemalertdlg'" [dlgRef]="deleteItemalertdlg" [title]="labels.delClientTitle" [type]="'YES-NO'"
  (doClick)="doDeleteItem($event)">
  <p>{{labels.delClientQuestion}}</p>
</pgalert>  
`
})
export class ClientsComponent implements AfterViewInit, OnDestroy {
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
    return { commandId: 'clients', clientId: this._parentId, 'examtype': this.examtype };
  }

  @Input() examtype: string;


  constructor(
    private _service: BrwService,
    private _texts: TextsService,
    private _user: UserService,
  ) {
    let textlib = [users, clients, textdata, panelbuttons];
    this.labels = _texts.toObject(textlib, _user.lng);
    this.access = _user.getAccess();

    this._lngSub = this._onLngChng = this._user.getLngChng().subscribe(lng => {
      this.labels = this._texts.toObject(textlib, lng);
    });

    this.oid = 'exagrps/clients';
    this._service.register(this, this._service.getUUID(this.oid));
  }

  ngAfterViewInit() {
    this._subscribe = this._service.onCommand$.subscribe(cmd => {
      if (cmd.cid == '#rowchanged' && cmd.oid == this.poid) {
        // this.parentId = (cmd.row ? cmd.row.id : null);
        this.parentId = (cmd.row ? cmd.row.usr : null);
        this._service.refresh(this._uuid, this.qparams);
      }
    })
  }

  ngOnDestroy() {
    if (this._subscribe) this._subscribe.unsubscribe();
    if (this._lngSub) this._lngSub.unsubscribe();
  }

  private _deleteItem: string;
  deleteItemalertdlg: HTMLElement;
  protected alertUsrDlg(item) {
    if (this.access['adm']) {
      this._deleteItem = item.id;
      this.deleteItemalertdlg = document.getElementById('deleteItemalertdlg');
      $(this.deleteItemalertdlg).modal({ show: true, backdrop: false, keyboard: false });
    }
  }

  doDeleteItem(action: string) {
    if (action == 'YES') {
      let crudcmd = Object.assign({}, { 'oid': 'exagrps', 'cid': 'delclient', 'qparams': { 'clientId': this._parentId , 'examtype': this.examtype} });
      this._service.upsert(crudcmd, { clientId: this._deleteItem }).subscribe(
        body => {
          this._service.refresh(this.uuid,this.qparams);
        }
      )
    }
  }


}
