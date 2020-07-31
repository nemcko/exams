import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { ComposeMessageComponent }  from './compose-message.component';
import { PageNotFoundComponent } from './not-found.component';
import { LoginComponent } from './login/login.component';

import { CanDeactivateGuard, AuthGuard } from './shared/services';
import { SelectivePreloadingStrategy } from './shared/services/selective-preloading-strategy';


const appRoutes: Routes = [
  // {
  //   path: 'compose',
  //   component: ComposeMessageComponent,
  //   outlet: 'popup'
  // },
  // {
  //   path: 'admin',
  //   loadChildren: 'app/admin/admin.module#AdminModule',
  //   canLoad: [AuthGuard]
  // },
  // {
  //   path: 'crisis-center',
  //   loadChildren: '../app/crisis-center/crisis-center.module#CrisisCenterModule',
  //   data: { preload: true }
  // },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'crisis-center',
    loadChildren: '../app/crisis-center/crisis-center.module#CrisisCenterModule',
    data: { preload: true }
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
  {
    path: 'examed',
    loadChildren: '../app/examed/examed.module#ExamedModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
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

// @NgModule({
//   imports: [RouterModule.forRoot(routes, { useHash: true })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
