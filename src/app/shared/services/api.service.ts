import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IConfig, APP_CONFIG } from '../config';
import { Observable, of } from 'rxjs';
import { StateService } from './state.service';

// import { delay }      from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    @Inject(APP_CONFIG) protected config: IConfig,
    public http: Http,
    public httpCl: HttpClient,
    public state: StateService,
  ) { }

  public getAll(name: string): Promise<Object> {
    return this.http.get(`${this.config.apiUri}/${name}`)
      .toPromise()
      .then((response) => {
        return response.json();
      }).catch((err) => {
        console.log(err);
      });
  }

  public authOption(type: string = 'blob'): any {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      const headers = new HttpHeaders({
        'Authorization': "Bearer " + currentUser.token
      })
      return { headers: headers, responseType: type };
    } else return null;
  }

  public docId(examid: string | number, prefix: string = ''): string {
    let s = parseInt(examid + '') + '';
    while (s.length < 10) s = "0" + s;
    return this.state.md5(prefix + s);
  }

  public getWebUrl(uri: string) {
    return `${this.config.webUrl}/${uri}`;
  }

  public getApiUrl(uri: string) {
    return `${this.config.apiUri}/${uri}`;
  }

  public getData(uri: string) {
    return this.http.get(this.getApiUrl(uri));
  }

  public postData(uri: string, body: any) {
    return this.httpCl.post(this.getApiUrl(uri), body, this.authOption());
  }

  public deleteData(uri: string) {
    return this.httpCl.delete(this.getApiUrl(uri), this.authOption('json'));
  }


  // getAll(): Observable<any>  {
  //   return of(testdata1).pipe(delay(FETCH_LATENCY));
  // }

  // public getAll<T>(): Observable<T> {
  //   return this.http.get<T>(this.actionUrl);
  // }
}
