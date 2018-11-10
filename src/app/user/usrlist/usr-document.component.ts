import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { ApiService } from '../../shared/services';
import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd } from '../../shared/services';
import { ApiModel } from "../../shared";
import * as textdata from './usrlist.component.json';
import * as languages from '../../languages.json';
import * as panelbuttons from '../../panelbuttons.json';

@Component({
  selector: 'userdoc',
  template: `
  <div class="modal-header pb-1">
  <h4 class="modal-title">{{labels.titleExamDocument}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body pt-0 pb-0">

  <form [formGroup]="dataForm" (ngSubmit)="onSubmit()">
    <div class="border border-primary rounded px-2">
      <div class="form-row mt-2">
        <div class="form-group col-8" frminput [id]="'name'" [fld]="f.name" [labels]="labels">
            <input type="text" name="name" [readonly]="id && id!==''" formControlName="name" class="form-control"
                [ngClass]="{ 'is-invalid': f.name.errors }" />
        </div>
        <div class="form-group col-4" frminput [id]="'type'" [fld]="f.type" [labels]="labels">
          <select formControlName="type" class="form-control" id="type" [ngClass]="{ 'is-invalid': f.type.errors }">
            <option [value]="item.type" *ngFor="let item of labels.doctypes">{{item.name}}</option>
          </select>            
        </div>
      </div>

      <div class="form-row">
        <file-drop class="col-12 p-2" headertext="{{labels.droptext}}" (onFileDrop)="dropped($event)" 
        (onFileOver)="fileOver($event)" (onFileLeave)="fileLeave($event)">
            <span></span>
        </file-drop>
      </div>

      <div class="form-row">
        <div class="form-group col-5" frminput [id]="'dafr'" [fld]="f.dafr" [labels]="labels">
          <input type="text" name="dafr" formControlName="dafr" class="form-control" type="date" useValueAsDate />
        </div>
        <div class="form-group col-5" frminput [id]="'dato'" [fld]="f.dato" [labels]="labels">
          <input type="text" name="dato" formControlName="dato" class="form-control" type="date" useValueAsDate />
        </div>
      </div>

     <div class="form-row">
        <div class="form-group col-12" frminput [id]="'comment'" [fld]="f.comment" [labels]="labels">
            <input type="text" name="comment" formControlName="comment" class="form-control" />
        </div>
      </div>

    </div>
  </form>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-dismiss="modal" (click)="activeModal.dismiss('Cross click')">{{labels.btnclose}}</button>
  <button [disabled]="isNew" type="button" class="btn btn-secondary" data-dismiss="modal" (click)="deleteData()">{{labels.btndelete}}</button>
  <button [disabled]="dataForm.invalid" type="submit" class="btn btn-primary" (click)="onSubmit()">{{labels.btnsave}}</button>
</div>
`
})
export class UsrDocumentComponent implements OnInit {
  private _onLngChng: Subscription;
  private _id;
  private _uuid: string;
  private _refrUuid: string;
  protected submitted = false;
  public isNew = true;
  public dataForm: FormGroup;
  public labels = {};
  public oid = 'usrdoc';
  public access: {};

  public get recid() {
    return this._id;
  }

  constructor(
    private _api: ApiService,
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
      name: ['', Validators.required],
      type: ['', Validators.required],
      comment: [''],
      dafr: [''],
      dato: ['']
    });
  }

  ngOnDestroy() {
    if (this.isNew) {
      this._api.deleteData(`usrdocument/${this._service.md5(this._parent.qparam.rowId)}/${this._id}`).subscribe(data => {
      })
    }
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
          this.isNew = false;
          this._service.setReceivedData(record, body.items[0]);
          this.dataForm.patchValue(record);
        }
      )
    } else this._id = this._service.md5(this._service.uniqueID);
  }

  protected get f() { return this.dataForm.controls; }

  protected onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
      return;
    }
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'update' });
    let record = this.dataForm.getRawValue();
    record.usr = this._parent.parentId;
    this._service.upsert(crudcmd, record).subscribe(
      body => {
        this.isNew = false;
        this._parent._service.refresh(this._refrUuid);
        this.activeModal.close('Close click');
      }
    )
  }

  protected deleteData() {
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._id, cid: 'delete' });
    let cid=this._service.md5(this._parent.qparams.rowId);
    let id=this._id;
    this._service.upsert(crudcmd).subscribe(
      body => {
        this._api.deleteData(`usrdocument/${cid}/${id}`).subscribe(data => {
          this._parent._service.refresh(this._refrUuid);
          this.activeModal.close('Close click');
        })
      }
    )
  }

  public files: UploadFile[] = [];
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const formData = new FormData()
          formData.append('filedata', file, droppedFile.relativePath);
          formData.append('rowId', this._parent.qparam.rowId);

          this._api.postData(`usrdocument/${this._id}`, formData)
            .subscribe(data => {
              this.dataForm.patchValue({ name: droppedFile.relativePath });

            })
          return;
        });
      }
    }
  }

  public fileOver(event) {
  }

  public fileLeave(event) {
  }
}
