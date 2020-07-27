import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, AuthGuard } from '../shared/services';
import { ExamsComponent } from './exams.component';
// import { ExaminationsComponent } from './examinations.component';
// import { EvaluationsComponent } from './evaluations.component';
// import { TrainingsComponent } from './trainings.component';

const routes: Routes = [
  {
    path: '',
    component: ExamsComponent,
    children: [
      // { path: 'lpe', component: ExaminationsComponent, canActivate: [AuthGuard] }
      // , { path: 'lpr', component: EvaluationsComponent, canActivate: [AuthGuard] }
      // , { path: 'lpt', component: TrainingsComponent, canActivate: [AuthGuard] }
      // , { path: '', redirectTo: 'lpe', pathMatch: 'full' }
      { path: '', component: ExamsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
