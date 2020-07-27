
import {throwError as observableThrowError,  Observable ,  EMPTY } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { StateService, ShowLoadingService } from '../services';

@Injectable()
export class AddHeadersInterceptor implements HttpInterceptor {
    constructor(
        private _showloading: ShowLoadingService,
        private _state: StateService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // let authReq = req;
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this._showloading.doMessage("httpstart");
        // if (currentUser && currentUser.token) {
        //     // authReq = (req.url.indexOf('/xxx/')==-1 ? req : req.clone({ headers: req.headers.set("Authorization", "Bearer " + currentUser.token) }));
        //     authReq= req.clone({ headers: req.headers.set("Authorization", "Bearer " + currentUser.token) });
        // }
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
                return observableThrowError(err);
                // if ((err.status == 400) || (err.status == 401)) {
                //     // this.interceptorRedirectService.getInterceptedSource().next(err.status);
                //     return EMPTY;
                // } else {
                //     return Observable.throw(err);
                // }
            })
        )
    }
}