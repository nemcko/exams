import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthGuard } from '../shared/services';

import { ExasetsListComponent } from './exasets-list.component';

const routes: Routes = [
  {
    path: '',
    component: ExasetsListComponent,
    children: [
        { path: 'adm', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'lpes', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'lprs', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'lpts', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'lpe', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'lpr', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'lpt', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: 'req', component: ExasetsListComponent, canActivate: [AuthGuard] }
      , { path: '', redirectTo: 'req', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExasetRoutingModule { }
