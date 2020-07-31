import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';

import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd } from '../../shared/services';
import { ApiModel } from "../../shared";
import * as textdata from './usrlist.component.json';
import * as languages from '../../languages.json';
import * as panelbuttons from '../../panelbuttons.json';

@Component({
  selector: 'userlng',
  template: `
  <div class="modal-header pb-1">
  <h4 class="modal-title">{{labels.titleExamLang}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body pt-0 pb-0">

  <form [formGroup]="dataForm" (ngSubmit)="onSubmit()">

      <div class="border border-primary rounded px-2">
          <div class="form-row mt-2">
              <div class="form-group col-12" frminput [id]="'lng'" [fld]="f.lng" [labels]="labels">
                <select formControlName="lng" class="form-control" id="lng"  [disabled]="id && id!==''">
                  <option [value]="item.lng" *ngFor="let item of labels.lngs">{{item.name}}</option>
                </select>            
              </div>
          </div>

          <div class="form-row">
              <div class="form-group col-12" frminput [id]="'level'" [fld]="f.level" [labels]="labels">
                <select formControlName="level" class="form-control" id="level">
                  <option [value]="item.level" *ngFor="let item of labels.lnglevels">{{item.name}}</option>
                </select>            
              </div>
          </div>

          <div class="form-row">
              <div class="form-group col-12 mt-2 mb-4" frmcheckbox [id]="'rtf'" [fld]="f.rtf" [labels]="labels">
                  <input class="custom-control-input" type="checkbox" value="" id="rtf" formControlName="rtf">
              </div>
          </div>

      </div>
  </form>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-dismiss="modal" (click)="activeModal.dismiss('Cross click')">{{labels.btnclose}}</button>
  <button [disabled]="!recid" type="button" class="btn btn-secondary" data-dismiss="modal" (click)="deleteData()">{{labels.btndelete}}</button>
  <button [disabled]="dataForm.invalid" type="submit" class="btn btn-primary" (click)="onSubmit()">{{labels.btnsave}}</button>
</div>
`
})
export class UsrLanguageComponent implements OnInit {
  private _onLngChng: Subscription;
  private _id;
  private _uuid: string;
  private _refrUuid: string;
  protected submitted = false;
  public dataForm: FormGroup;
  public labels = {};
  public oid = 'usrlng';
  public access: {};

  public get recid() {
    return this._id;
  }

  constructor(
    private _user: UserService,
    private _service: BrwService,
    private _texts: TextsService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
    this.labels = _texts.toObject([languages, textdata, panelbuttons], _user.lng);
    this.access = _user.getAccess();
    this._uuid = this._refrUuid = this._service.getUUID(this.oid);
  }

  ngOnInit() {
    this._onLngChng = this._user.getLngChng().subscribe(lng => {
      this.labels = this._texts.toObject([languages, textdata, panelbuttons], lng);
    });

    this.dataForm = this._formBuilder.group({
      lng: ['', Validators.required],
      level: ['', Validators.required],
      rtf: [false]
    });

  }

  private _parent: any;
  public lodaData(userId, parent, uuid = '') {
    this._parent = parent;
    this._refrUuid = (uuid ? uuid : this._uuid);
    if (userId) {
      this._service.cmd(Object.assign({}, { oid: this.oid, id: userId })).subscribe(
        body => {
          let record = {};
          this._id = userId;
          this._service.setReceivedData(record, body.items[0]);
          record['rtf']=record['rtf']==='1';
          this.dataForm.patchValue(record);
        }
      )
    } else this._id = '';
  }

  protected get f() { return this.dataForm.controls; }

  protected onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
      return;
    }
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'update' });
    let record = this.dataForm.getRawValue();
    record.usr=this._parent.parentId;
    this._service.upsert(crudcmd, record).subscribe(
      body => {
        this._parent._service.refresh(this._refrUuid);
        this.activeModal.close('Close click');
      }
    )
  }

  protected deleteData() {
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'delete' });
    this._service.upsert(crudcmd).subscribe(
      body => {
        this._parent._service.refresh(this._refrUuid);
        this.activeModal.close('Close click');
      }
    )
  }

}
