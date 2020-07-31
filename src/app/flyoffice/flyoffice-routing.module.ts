import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlyofficeListComponent } from './flyoffice-list.component';

const routes: Routes = [
  {
    path: '',
    component: FlyofficeListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlyofficeRoutingModule { }
