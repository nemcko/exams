import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, pipe } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserService } from '../user'
import { AuthService } from '../shared/services'
import { TextsService, CrudService, ICrudCmd, ShowLoadingService } from '../shared/services';
import { ApiModel } from "../shared";
import * as textdata from './login.component.json';
import * as languages from '../languages.json';

// import { AlertService, AuthenticationService } from '../_services';

@Component({
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    private _onLngChng: Subscription;
    protected loginForm: FormGroup;
    protected submitted = false;
    protected returnUrl: string;
    public loading = false;
    public error = '';
    public labels = {};
    public lngs = ['en', 'sk'];

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _authenticationService: AuthService,
        // private alertService: AlertService,
        public texts: TextsService,
        // private _showloading: ShowLoadingService,
        private _user: UserService,
    ) {
        this.labels = texts.toObject([textdata, languages], _user.lng);
    }

    ngOnInit() {
        this.loginForm = this._formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            lng: [this._user.lng]
        });

        this._authenticationService.logout();
        // this._showloading.doMessage("login");
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

        this._onLngChng = this._user.getLngChng().subscribe(lng => {
            this.labels = this.texts.toObject([textdata, languages], lng);
            // this._user.doLngChng(lng);
        });

    }

    doLngChange(lngval) {
        this.labels = this.texts.toObject(textdata, lngval);
        this._user.doLngChng(lngval);
    }
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }
        this._user.setData('lng', this.f.lng.value);

        this.loading = true;
        this._authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe((isLoggedIn: boolean) => {
                this.loading = false;
                this._router.navigateByUrl(this._authenticationService.redirectUrl);
            }, error => {
                this.error = error;
                this._user.logged = false;
                this.loading = false;
            });
    }
}