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

// export class RequestEventEmitter extends Subject<String>{
//   constructor() {
//     super();
//   }
//   emit(value) { super.next(value); }
// }

// export class ResponseEventEmitter extends Subject<String>{
//   constructor() {
//     super();
//   }
//   emit(value) {
//     setTimeout(() => {
//       super.next(value);
//     }, 300);
//   }
// }

// @Injectable({ providedIn: 'root' })
// export class ShowLoadingService {
//   beforeRequest: RequestEventEmitter;
//   afterRequest: ResponseEventEmitter;

//   constructor() {
//     this.beforeRequest = new RequestEventEmitter();
//     this.afterRequest = new ResponseEventEmitter();
//   }
// }


