import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EnsureHttpsInterceptor } from './ensure-https-interceptor';
import { AddHeadersInterceptor } from './add-headers-interceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AddHeadersInterceptor, multi: true },
];
  