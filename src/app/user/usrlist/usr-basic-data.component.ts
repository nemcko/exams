import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';

import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd } from '../../shared/services';
import { ApiModel } from "../../shared";
import * as textdata from './usrlist.component.json';
import * as examinators from '../examinators.json';
import * as users from '../../user/users.json';
import * as validators from '../../validators.json';
import * as panelbuttons from '../../panelbuttons.json';

@Component({
  selector: 'app-usr-basic-data',
  templateUrl: './usr-basic-data.component.html',
})
export class UsrBasicDataComponent implements OnInit {
  private _id;
  private _uuid: string;
  private _refrUuid: string;
  protected submitted = false;
  public profileForm: FormGroup;
  public labels = {};
  public oid = 'user';
  public examtype: string = 'all';
  public access: {};
  public languages: Array<NgOption>;

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
    this.labels = _texts.toObject([users, examinators, textdata, panelbuttons, validators], _user.lng);
    this.access = _user.getAccess();
    this._uuid = this._refrUuid = this._service.getUUID(this.oid);
    this.languages = this._texts.getLanguages(this._user.lng);
  }

  ngOnInit() {
    this.profileForm = this._formBuilder.group({
      usr: ['', [Validators.required, Validators.maxLength(32), this.validateUrl]],
      firstname: ['', [Validators.maxLength(45)]],
      lastname: ['', [Validators.maxLength(45)]],
      phone: ['', [Validators.maxLength(10)]],
      mobile: ['', [Validators.maxLength(10)]],
      email: ['', [Validators.maxLength(45)]],
      web: ['', [Validators.maxLength(45)]],
      profession: ['', [Validators.maxLength(45)]],
      speaks: ['', [Validators.required]],
      lpes: [false],
      lprs: [false],
      lpts: [false],
      lpe: [false],
      lpr: [false],
      lpt: [false],
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
          record['speaks'] = this._texts.toNgSelect(record['speaks'], this._user.lng);
          this.profileForm.patchValue(record);
        }
      )
    } else this._id = '';
  }

  protected validateUrl(control: AbstractControl) {
    if (control.value.startsWith('https') && control.value.includes('.io')) {
      return { validUrl: true };
    }
    return null;
  }


  protected get f() { return this.profileForm.controls; }

  protected onSubmit() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'update' });
    let record = this.profileForm.getRawValue();
    record['speaks'] = this._texts.fromNgSelect(record['speaks'], this._user.lng);
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
