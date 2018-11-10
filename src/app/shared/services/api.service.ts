import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IConfig, APP_CONFIG } from '../config';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    @Inject(APP_CONFIG) protected config: IConfig,
    public http: Http,
    public httpCl: HttpClient,
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

  public authOption(type: string = 'blob'):any {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      const headers = new HttpHeaders({
        'Authorization': "Bearer " + currentUser.token
      })
      return { headers: headers, responseType: type };
    } else return null;
  }

  public postData(uri: string, body: any) {
    return this.httpCl.post(`${this.config.apiUri}/${uri}`, body, this.authOption());
  }

  public deleteData(uri: string) {
    return this.httpCl.delete(`${this.config.apiUri}/${uri}`, this.authOption('json'));
  }

}
