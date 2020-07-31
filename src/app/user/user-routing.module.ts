import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, AuthGuard } from '../shared/services';
import { UserComponent } from './user.component';
import { UsrlistComponent } from './usrlist/usrlist.component';
import { ProfileComponent } from './profile/profile.component';
import { DetailComponent } from './profile/detail/detail.component';
import { DocumentsComponent } from './profile/documents/documents.component';
import { ExaminationsComponent } from './profile/examinations/examinations.component';
import { EvaluationsComponent } from './profile/evaluations/evaluations.component';
import { TrainingsComponent } from './profile/trainings/trainings.component';



import { TestuiComponent } from './testui/testui.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      // {
      //   path: '',
      //   component: UsrlistComponent, canActivate: [AuthGuard],
      //   children: [
      //     {
      //       path: '', redirectTo: '../profile/detail', pathMatch: 'full'
      //     }, {
      //       path: 'xxx',
      //       component: UsrdetailComponent,
      //       canDeactivate: [CanDeactivateGuard],
      //       // resolve: {
      //       //   crisis: CrisisDetailResolver
      //       // }
      //     }
      //   ]
      // },
       {
        path: 'testui',
        component: TestuiComponent,
      }
      , { path: '', component: UsrlistComponent, canActivate: [AuthGuard] }
     , {
        path: 'profile',
        component: ProfileComponent, canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'detail', pathMatch: 'full' },
          { path: 'detail', component: DetailComponent, canActivate: [AuthGuard] },
          { path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard] },
          { path: 'examinations', component: ExaminationsComponent, canActivate: [AuthGuard] },
          { path: 'evaluations', component: EvaluationsComponent, canActivate: [AuthGuard] },
          { path: 'trainings', component: TrainingsComponent, canActivate: [AuthGuard] }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
