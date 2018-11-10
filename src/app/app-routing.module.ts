import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './not-found.component';
import { LoginComponent } from './login/login.component';

import { CanDeactivateGuard, AuthGuard } from './shared/services';
import { SelectivePreloadingStrategy } from './shared/services/selective-preloading-strategy';


const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'exams',
    loadChildren: '../app/exam/exam.module#ExamModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'users',
    loadChildren: '../app/user/user.module#UserModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'addresses',
    loadChildren: '../app/address/address.module#AddressModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'clients',
    loadChildren: '../app/client/client.module#ClientModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'flyoffices',
    loadChildren: '../app/flyoffice/flyoffice.module#FlyofficeModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'exasets',
    loadChildren: '../app/exaset/exaset.module#ExasetModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategy,
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule { }