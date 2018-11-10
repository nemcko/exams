import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';
import { IConfig, APP_CONFIG } from '../config';
import { ApiModel } from "../../shared";
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public get isLoggedIn(): boolean {
    return this._state.isLoggedIn;
  }
  public get accessToken(): string {
    return this._state.token;
  }

  public redirectUrl: string = '/users';

  constructor(
    @Inject(APP_CONFIG) protected config: IConfig, 
    private _http: HttpClient,
    private _state: StateService,
    ) {
  }

  public login(username: string, password: string): Observable<boolean> {
    let getLoginUrl = (cfg) => {
      let url: string = cfg.apiUri + '/users/authenticate'
      return url;
    }
    let url: string = getLoginUrl(this.config);
    let logdata: ApiModel.Login = <ApiModel.Login>{ "usr": username, "pwd": password };
    let self = this;
    this._state.logout();
    return this._http.post<ApiModel.Login>(url, JSON.stringify(logdata))
      .pipe(
        tap(this.extractData),
        catchError(this.onError)
      );
  }

  protected extractData(user) {
    if (user && user.token) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    return this.isLoggedIn;  
  }

  protected onError(error: Response | any) {
    return throwError(error.message || error);
  }


  public logout() {
    this._state.logout();
  }

}

