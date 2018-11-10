import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,filter } from 'rxjs/operators';
import { IConfig, APP_CONFIG } from '../../shared/config';
import { UserService } from '../../user';
import { TextsService, CrudService, ICrudCmd } from '../../shared/services';
import { ApiModel } from "../../shared";
import * as textdata from './profile.component.json';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public labels = {};
  public apiUri: string;
  public seluser: any = {};
  public activeurl:string;

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _user: UserService,
    private _crud: CrudService,
    @Inject(APP_CONFIG) protected config: IConfig,
    public texts: TextsService,
  ) {
    this.labels = texts.toObject(textdata,_user.lng);
    this.apiUri = config.apiUri;
    this.seluser = this._user.getData('seluser');
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({url}: NavigationEnd) => {
        this.activeurl=url;
      });
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
