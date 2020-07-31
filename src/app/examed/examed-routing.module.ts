import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamedListComponent } from './examed-list.component';


const routes: Routes = [
  {
    path: '',
    component: ExamedListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamedRoutingModule { }
