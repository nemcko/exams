import { Injectable } from '@angular/core';
import { empty, of, Observable } from "rxjs";
import { BrwService } from '../components/browse/brw.service';

@Injectable()
export class FieldValidatorService {
  private _cache = {};

  constructor(
    private _service: BrwService,
  ) { }

  public validate(cid: string, value: string): Observable<any> {
    // let elem = this.el.nativeElement;

    if (!this._cache[cid]) {
      return this.findValue(cid, value);
    } else {
      if (this._cache[cid].value == value) {
        return empty();
      } else {
        return this.findValue(cid, value);
      }
    }
  }

  protected findValue(cid: string, value: string): Observable<any> {
    let observable = Observable.create(observer => {
      this._service.validate({ oid: 'validators/' + cid, brwFieldValue: value })
        .subscribe(
          body => {
            this._cache[cid] = { value: value, result: true };
            observer.next({ [cid + 'Exist']: true });
          },
          err => {
            this._cache[cid] = { value: value, result: null };
            observer.complete();
            // observer.next({ [cid + 'Exist']: true });
         }
        )
    })
    return observable;
  }
}
