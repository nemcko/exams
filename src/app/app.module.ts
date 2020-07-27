import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptorProviders } from './shared/intercept';
import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { PageNotFoundComponent } from './not-found.component';
import { DialogService } from './shared/services/dialog.service';

import { IConfig, APP_CONFIG, CONFIG } from './shared/config';
import { StateService, CrudService, TextsService, BrwService } from './shared/services';
import { NavDropdownDirective } from './shared/components/directives';
import { LoginComponent } from './login/login.component';
import { AddressModule } from './address/address.module';
import { ClientModule } from './client/client.module';
import { FlyofficeModule } from './flyoffice/flyoffice.module';
import { ExasetModule } from './exaset/exaset.module';
import { ExamModule } from './exam/exam.module';
import { SearchPlaceComponent } from './shared/components/place/search-place.component';

import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import { ExamedModule } from './examed/examed.module';


registerLocaleData(localeSk, 'sk');

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavDropdownDirective,
    LoginComponent,
    SearchPlaceComponent,
  ],
  imports: [
    HttpModule, HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    AddressModule,
    ClientModule,
    FlyofficeModule,
    ExasetModule,
    ExamModule,
    ExamedModule
  ],
  providers: [
    DialogService,
    { provide: APP_CONFIG, useValue: CONFIG },
    { provide: LOCALE_ID, useValue: 'sk' },
    StateService, CrudService, TextsService, BrwService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
