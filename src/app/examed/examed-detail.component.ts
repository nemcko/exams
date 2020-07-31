import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
declare let $: any;

import { ApiService } from '../shared/services';
import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd } from '../shared/services';
import { ApiModel } from "../shared";
import * as textdata from './examed-list.component.json';
import * as validators from '../validators.json';
import * as panelbuttons from '../panelbuttons.json';

@Component({ template: '' })
export class SetexamDeleteComponent {
  constructor(public activeModal: NgbActiveModal) { }
}

@Component({
  selector: 'examed-detail',
  templateUrl: './examed-detail.component.html',
  styles: []
})
export class ExamedDetailComponent implements OnInit {
  private _id;
  private _uuid: string;
  public detailForm: FormGroup;
  public labels = {};
  public oid = 'examed';
  public access: {};
  protected submitted = false;


  public get recid() {
    return this._id;
  }

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
    this.labels = texts.toObject([textdata, panelbuttons, validators], _user.lng);
    this.access = _user.getAccess();
    this._uuid = this._service.getUUID(this.oid);
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      type: ['',],
      name: ['', [Validators.required, Validators.maxLength(65)]],
      filename: ['',],
      act: [false,],
    });
  }

  private _parent: any;
  public lodaData(userId, parent) {
    this._parent = parent;
    this._service.cmd(Object.assign({}, { oid: this.oid, id: userId || '' }), { 'type': 'd' }).subscribe(
      body => {
        let record = {};
        this._service.setReceivedData(record, body.items[0]);
        this._id = record['id'];
        record['act'] = record['act'] == '1';
        this.detailForm.patchValue(record);
      }
    )
  }

  protected get f() { return this.detailForm.controls; }

  protected onSubmit() {
    this.submitted = true;
    if (this.detailForm.invalid) {
      return;
    }
    let crudcmd = Object.assign({}, { oid: this.oid, id: this.recid, cid: 'update' });
    let record = this.detailForm.getRawValue();
    this._service.upsert(crudcmd, record).subscribe(
      body => {
        this._parent._service.refresh(this._uuid);
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
      let crudcmd = Object.assign({}, { oid: this.oid, id: this.recid, cid: 'delete' });
      this._service.upsert(crudcmd).subscribe(
        body => {
          this._parent._service.refresh(this._uuid);
          this.activeModal.close('Close click');
        }
      )
    }
  }

  public get availExt(): string {
    switch (this.detailForm.value.type) {
      case 'd':
        return ApiModel.ext_doc;
      case 'a':
        return ApiModel.ext_audio;
      case 'v':
        return ApiModel.ext_video;
      default: return '';
    }
  }
  public get docUri(): string {
    return 'mediafile';
  }


  public files: UploadFile[] = [];
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          let foundext = false;
          let ext = droppedFile.relativePath.split('.').pop().toLowerCase();
          this.availExt.split(',').map(e => {
            if (e.trim().replace('*.', '') == ext) {
              foundext = true;
            }
          });
          if (!foundext) {
            this._user.showToast({ type: 'error', message: this.labels['badextension'] });
            return;
          };

          const formData = new FormData()
          formData.append('filedata', file, droppedFile.relativePath);
          formData.append('type', this.docUri);
          this._api.postData(`appdocument/${this._api.docId(this.recid, 'MD')}`, formData)
            .subscribe(data => {
              this.detailForm.patchValue({ 'filename': droppedFile.relativePath });
            })
          return;
        });
      }
    }
  }

  public fileOver(event) {
    // console.log(event);

  }

  public fileLeave(event) {
    // console.log(event);
  }


}
