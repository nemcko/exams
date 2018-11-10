import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../user'
import { TextsService, CrudService, ICrudCmd } from '../../../shared/services';
import { ApiModel } from "../../../shared";
import * as textdata from './trainings.component.json';
import * as rtfexam from '../../rtfexam.json';

@Component({
  selector: 'proftra',
  templateUrl: './trainings.component.html'
})
export class TrainingsComponent implements OnInit {
  public profileForm: FormGroup;
  public labels = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _crud: CrudService,
    private _user: UserService,
    public texts: TextsService,
    private _modalService: NgbModal
  ) { 
    this.labels = texts.toObject([textdata,rtfexam],_user.lng); 
  }

  protected modalRef;

  openDlg(content) {
    this.modalRef = this._modalService.open(content, { size: 'lg' });
  }

  closeDlg(){
    this.modalRef.dismiss('Cross click')
  }



  rowDoubleClick(rowEvent) {
  }

  ngOnInit() {
    this.profileForm = this._formBuilder.group({
      username: ['', Validators.required],
      firstname: [''],
      lastname: [''],
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
}
