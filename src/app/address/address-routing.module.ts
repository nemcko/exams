import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, AuthGuard } from '../shared/services';
import { AddressListComponent } from './address-list.component';

const routes: Routes = [
  {
    path: '',
    component: AddressListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule { }
