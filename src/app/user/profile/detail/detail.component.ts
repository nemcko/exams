import { Component,  OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../../../user'
import { TextsService, CrudService, ICrudCmd } from '../../../shared/services';
import { ApiModel } from "../../../shared";
import * as textdata from './detail.component.json';

@Component({
  selector: 'profdet',
  templateUrl: './detail.component.html',
  styleUrls: ['../profile.component.css']
})
export class DetailComponent implements OnInit {
  public profileForm: FormGroup;
  public labels = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _crud: CrudService,
    public texts: TextsService,
    private _user: UserService,
  ) { 
    this.labels = texts.toObject(textdata,_user.lng); 
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

    // this.authenticationService.login(this.f.username.value, this.f.password.value)
    //     .pipe(first())
    //     .subscribe(
    //         data => {
    //             this._router.navigate([this.returnUrl]);
    //         },
    //         error => {
    //             this.alertService.error(error);
    //             this.loading = false;
    //         });
  }
}
