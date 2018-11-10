import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, AuthGuard } from '../shared/services';
import { ExamsComponent } from './exams.component';

const routes: Routes = [
  {
    path: '',
    component: ExamsComponent,
    children: [
      { path: '', component: ExamsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
