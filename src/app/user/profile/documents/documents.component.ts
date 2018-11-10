import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateStruct} from "@ng-bootstrap/ng-bootstrap"
import {DatePipe} from "@angular/common";

import { UserService } from '../../../user'
import { TextsService, CrudService, ICrudCmd } from '../../../shared/services';
import { ApiModel } from "../../../shared";
import * as textdata from './documents.component.json';

@Component({
  selector: 'profdoc',
  templateUrl: './documents.component.html'
})
export class DocumentsComponent implements OnInit {
  public profileForm: FormGroup;
  public labels = {};

  public startDate: NgbDateStruct;
  public startCheck: boolean = false;
  public endDate: NgbDateStruct;
  public endCheck: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _crud: CrudService,
    public texts: TextsService,
    private _user: UserService,
    private _modalService: NgbModal
  ) { 
    this.labels = texts.toObject(textdata,_user.lng); 
  }

  protected modalRef;

  openDlg(content) {
    this.modalRef = this._modalService.open(content);
  }

  closeDlg(){
    this.modalRef.dismiss('Cross click')
  }


  rowDoubleClick(rowEvent) {
    alert(JSON.stringify(rowEvent.row));
  }

  ngOnInit() {
    this.profileForm = this._formBuilder.group({
      username: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      phone: [''],
      mobile: [''],
      email: [''],
      web: [''],
      profession: [''],
      speaks: ['']
    });

  }

  get f() { return this.profileForm.controls; }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }
  }


  public getDate(dateName: string) {
    let workingDateName = dateName + 'Date';
    let timestamp = this[workingDateName] != null ? new Date(this[workingDateName].year, this[workingDateName].month-1, this[workingDateName].day).getTime() : new Date().getTime();
  }
  
  public showDatePick(selector):void {
    if(selector === 0) {
      this.startCheck = !this.startCheck
    } else {
      this.endCheck = !this.endCheck;
    }
  }
}
