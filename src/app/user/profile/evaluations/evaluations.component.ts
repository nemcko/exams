import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../user'
import { TextsService, CrudService, ICrudCmd } from '../../../shared/services';
import { ApiModel } from "../../../shared";
import * as textdata from './evaluations.component.json';
import * as evaluation from '../../evaluvation.json';
import * as examination from '../../examination.json';
import * as notifycation from '../../notifycation.json';


@Component({
  selector: 'profeva',
  templateUrl: './evaluations.component.html'
})
export class EvaluationsComponent implements OnInit {
  public profileForm: FormGroup;
  public labels = {};
  public viewcard="lpe";

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _crud: CrudService,
    public texts: TextsService,
    private _user: UserService,
    private _modalService: NgbModal
  ) { 
    this.labels = texts.toObject([textdata,examination,notifycation,evaluation],_user.lng); 
  }

  protected modalRef;

  openDlg(content) {
    this.modalRef = this._modalService.open(content, { size: 'lg' });
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
