import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StateService, ShowLoadingService } from '../services';

@Injectable()
export class AddHeadersInterceptor implements HttpInterceptor {
    constructor(
        private _showloading: ShowLoadingService,
        private _state: StateService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._showloading.doMessage("httpstart");
        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this._showloading.doMessage();
                    return event.body;
                }
            }),
            catchError((err: HttpErrorResponse) => {
                this._showloading.doMessage();
                this._state.showToast({ type: 'error', message: err.message});
                return Observable.throw(err);
            })
        )
    }
}