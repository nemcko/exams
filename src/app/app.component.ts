import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Mutex } from 'async-mutex';
declare var $: any;
declare var jQuery: any;
import * as toastr from 'toastr';

import { UserService } from './user'
import { TextsService, ShowLoadingService, IToast } from './shared/services';
import * as textdata from './app.component.json';
import * as examinators from './user/examinators.json';
import * as languages from './languages.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  labels = {};
  buttontoggled: boolean = false;
  logged: boolean = false;
  private _onLngChng: Subscription;
  private _mutex: Mutex = new Mutex();

  hideLoader: boolean = true;

  constructor(
    public user: UserService,
    public texts: TextsService,
    private _showloading: ShowLoadingService,
  ) {
    this.logged = user.logged;
    this.user.setData('lng', 'en');
    this.labels = texts.toObject([examinators, textdata, languages], user.lng);
    this._showloading.show$.subscribe((show) => {
      this._mutex
        .acquire()
        .then(release => {
          // console.log('***' + (show));
          if (show)
            this.hideLoader = !show;
          else
            setTimeout(() => {
              this.hideLoader = !show;
            }, 300);
          release();
        });
    })
    
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.preventDuplicates = true;
    this.user.onToast$.subscribe(toast => {
      switch (toast['type']) {
        case 'success':
        case 'info':
        case 'warning':
        case 'error':
          toastr[toast['type']](toast.message, toast.title);
          break;
      }
    });
  }

  ngOnInit() {
    this._onLngChng = this.user.getLngChng().subscribe(lng => {
      this.labels = this.texts.toObject([examinators, textdata, languages], lng);
    });
  }

  doLngChange(lngval) {
    this.user.setData('lng', lngval);
  }

  ngOnDestroy() {
    this._onLngChng.unsubscribe();
  }

  OnClik() {
    this.buttontoggled = !this.buttontoggled;
  }

  private _examtype: string = 'exa';
  protected get examtype(): string {
    return this._examtype;
  }

  // protected selExaminatorType(code: string) {
  //   this._examtype = code;
  //   this.user.doExatypeChange(code);
  // }

}
