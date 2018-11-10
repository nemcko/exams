import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShowLoadingService {
  private _showLoading = new Subject<boolean>();
  public show$: Observable<boolean> = this._showLoading.asObservable();//.pipe(debounceTime(500));
  doMessage(msg?: string) {
    if (!msg) msg = '';
    this._showLoading.next(msg !== '');
  }
}