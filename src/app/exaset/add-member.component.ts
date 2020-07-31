import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../shared/services';
import * as textdata from './exasets-list.component.json';
import * as users from '../user/users.json';
import * as panelbuttons from '../panelbuttons.json';

@Component({
  selector: 'exasetmbr',
  template: `
  <pgaddlg [title]="labels.addMemberTitle+' ('+parentId+')'">
  <brw [uuid]="uuid" [oid]="oid" [service]="service" [qparams]="qparams">
    <brwtitle [brwFieldName]="'fullsearch'" [searchControl]="'search'">
      <div class="btn-group col-sm-12 px-0">
        <span class="input-group-text"><i class="fa fa-search" aria-hidden="true"></i></span>
        <input type="text" id="search" class="form-control px-1 text-primary" placeholder="{{labels.search}}">
      </div>
    </brwtitle>
    <brwcol [name]="'usr'" [header]="labels.usr" [width]="10"></brwcol>
    <brwcol [name]="'firstname'" [header]="labels.firstname" [width]="40"></brwcol>
    <brwcol [name]="'lastname'" [header]="labels.lastname" [width]="30"></brwcol>
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
export class AddMemberComponent {
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
    return { commandId: 'addmember', userId: this._parentId, examtype: this.parentQparams.examtype };
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

    this.oid = 'exagrps/addmember';
    this.uuid = this._refrUuid = this._service.getUUID('exagrps/addmember%add');
    this._service.register(this, this.uuid);
  }

  public setParent(poid: string, pid: string, qparam: any) {
    this.parentOid = poid;
    this.parentId = pid;
    this.parentQparams = qparam;
  }

  protected addItem(item) {
    if (this.access['adm']) {
      let viewoid='exagrps/members';
      let exepar = <ICrudExec>{};
      exepar.uuid = this.uuid;
      exepar.oid = this.oid;
      exepar.cid = 'newmember';
      exepar.payload = { userId: item.usr, parentId: this.parentQparams.userId, examtype: this.parentQparams.examtype };
      exepar.qparams = this.parentQparams;

      let viewpar = <ICrudCmd>{};
      viewpar.uuid = this._service.getUUID(viewoid);
      viewpar.oid = viewoid;
      viewpar.cid = 'members';
      viewpar.qparams = this.qparams;

      this._service.doExec(exepar, viewpar);
    }
  }

}
