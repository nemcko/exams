import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
declare let $: any;

import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd } from '../shared/services';
import * as textdata from './address-list.component.json';
import * as addresses from '../user/addresses.json';
import * as validators from '../validators.json';
import * as panelbuttons from '../panelbuttons.json';

@Component({ template: '' })
export class AddressDeleteComponent {
  constructor(public activeModal: NgbActiveModal) { }
}
@Component({
  selector: 'address-detail',
  templateUrl: './address-detail.component.html',
})
export class AddressDetailComponent implements OnInit {
  private _id;
  private _uuid: string;
  private _refrUuid: string;
  public detailForm: FormGroup;
  public labels = {};
  public oid = 'address';
  public access: {};
  protected submitted = false;


  public get recid() {
    return this._id;
  }

  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
    this.labels = texts.toObject([textdata, addresses, panelbuttons, validators], _user.lng);
    this.access = _user.getAccess();
    this._uuid = this._refrUuid = this._service.getUUID(this.oid);
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      address: ['', [Validators.required, Validators.maxLength(65)]],
      zip: ['', [Validators.required, Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.maxLength(65)]],
      state: ['', [Validators.required, Validators.maxLength(45)]],
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
          this.detailForm.patchValue(record);
        }
      )
    } else this._id = '';
  }

  protected get f() { return this.detailForm.controls; }

  protected onSubmit() {
    this.submitted = true;
    if (this.detailForm.invalid) {
      return;
    }
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'update' });
    let record = this.detailForm.getRawValue();
    this._service.upsert(crudcmd, record).subscribe(
      body => {
        this._parent._service.refresh(this._refrUuid);
        this.activeModal.close('Close click');
      }
    )
  }

  deleteAlert: HTMLElement;
  protected alertDlg() {
    if (this.access['adm']) {
      this.deleteAlert = document.getElementById('deletealertdlg');
      $(this.deleteAlert).modal({ show: true, backdrop: false, keyboard: false });
    }
  }

  doDelete(action: string) {
    if (action == 'YES') {
      let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'delete' });
      this._service.upsert(crudcmd).subscribe(
        body => {
          this._parent._service.refresh(this._refrUuid);
          this.activeModal.close('Close click');
        }
      )
    }
  }

}
