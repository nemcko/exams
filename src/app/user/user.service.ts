import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StateService, IToast } from '../shared/services';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _logged: boolean = true;
  private _data: any = {};
  private _lngsubject = new Subject<any>();
  // private _onExatypeChange: EventEmitter<string> = new EventEmitter<MyServiceEvent>();
  private _exatypeSubject = new Subject<string>();

  public get logged(): boolean {
    return this._logged;
  }
  public set logged(val: boolean) {
    this._logged = val;
  }

  constructor(
    private _state: StateService,
  ) { }

  public get lng(): string {
    return this.getData('lng') || 'en';
  }

  public setData(key: string, data: any) {
    let lng: string = this._data['lng'] || '';
    this._data[key] = data;
    if (key == 'lng' && lng !== this._data['lng']) {
      this.doLngChng(this._data['lng']);
    }
  }

  public getData(key: string): any {
    if (this._state.currentUser) this._data['access'] = this._state.currentUser.access || {};
    return this._data[key];
  }

  public getAccess() {
    return this._data['access'];
  }


  public doLngChng(newlng: string) {
    this._lngsubject.next(newlng);
  }

  public clearLngChng() {
    this._lngsubject.next();
  }

  public getLngChng(): Observable<any> {
    return this._lngsubject.asObservable();
  }

  public doExatypeChange(code: string) {
    // this._onExatypeChange.emit(code);
    this._exatypeSubject.next(code);
  }
  public getExatypeChange(): Observable<any> {
    return this._exatypeSubject.asObservable();
  }

  public onToast$: Observable<IToast> = this._state.onToast$;
  public showToast(toast: IToast) {
    this._state.showToast(toast);
  }
}
