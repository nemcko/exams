import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../shared/services';
import * as textdata from './exasets-list.component.json';
import * as clients from '../user/clients.json';
import * as panelbuttons from '../panelbuttons.json';

@Component({
  selector: 'exasetcli',
  template: `
  <pgaddlg [title]="labels.addClientTitle+' ('+parentId+')'">
  <brw [uuid]="uuid" [oid]="oid" [service]="service" [qparams]="qparams">
    <brwtitle [brwFieldName]="'fullsearch'" [searchControl]="'search'">
      <div class="btn-group col-sm-12 px-0">
        <span class="input-group-text"><i class="fa fa-search" aria-hidden="true"></i></span>
        <input type="text" id="search" class="form-control px-1 text-primary" placeholder="{{labels.search}}">
      </div>
    </brwtitle>
    <brwcol [name]="'name'" [header]="labels.name" [width]="30"></brwcol>
    <brwcol [name]="'code'" [header]="labels.code" [width]="5"></brwcol>
    <brwcol [name]="'id'" [width]="'28px'" [cls]="'p-0 float-right'" [visible]="access.adm">
      <ng-template #dataTableCell let-item="row">
        <button type="button" class="btn btn-primary btn-sm" (click)="addItem(item)">
          <span [class]="'fa fa-plus'"></span>
        </button>
      </ng-template>
    </brwcol>
  </brw>
</pgaddlg>
`
})
export class AddClientComponent {
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
    return { commandId: 'addclient', clientId: this._parentId, examtype: this.parentQparams.examtype };
  }




  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
    private _modalService: NgbModal,
  ) {
    this.labels = texts.toObject([textdata, clients, panelbuttons], _user.lng);
    this.access = _user.getAccess();

    this.oid = 'exagrps/addclient';
    this.uuid = this._refrUuid = this._service.getUUID('exagrps/addclient%add');
    this._service.register(this, this.uuid);
  }

  public setParent(poid: string, pid: string, qparam: any) {
    this.parentOid = poid;
    this.parentId = pid;
    this.parentQparams = qparam;
  }

  protected addItem(item) {
    if (this.access['adm']) {
      let viewoid = 'exagrps/clients';
      let exepar = <ICrudExec>{};
      exepar.uuid = this.uuid;
      exepar.oid = this.oid;
      exepar.cid = 'newclient';
      exepar.payload = { clientId: item.id, parentId: this.parentQparams.parentId, examtype: this.parentQparams.examtype };
      exepar.qparams = this.parentQparams;

      let viewpar = <ICrudCmd>{};
      viewpar.uuid = this._service.getUUID(viewoid);
      viewpar.oid = viewoid;
      viewpar.cid = 'clients';
      viewpar.qparams = this.qparams;

      this._service.doExec(exepar, viewpar);
    }
  }

}
