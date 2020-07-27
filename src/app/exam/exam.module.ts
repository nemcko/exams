import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { FileDropModule } from 'ngx-file-drop';
import { SharedModule } from '../shared/shared.module'

import { ExamRoutingModule } from './exam-routing.module';
import { ExamsComponent } from './exams.component';
import { ExamDirective } from './core/ctrl.directive';
import { ExamComponent } from './core/ctrl.component';
import { CardorderPipe } from './core/cardorder.pipe';
import { StateE01Component } from './cards/e01/state-e01.component';
import { StateE02Component } from './cards/e02/state-e02.component';
import { StateE03Component } from './cards/e03/state-e03.component';
import { StateE04Component } from './cards/e04/state-e04.component';
import { StateT01Component } from './cards/t01/state-t01.component';
import { StateT02Component } from './cards/t02/state-t02.component';
import { StateT03Component } from './cards/t03/state-t03.component';
import { ExamIdComponent } from './cards/exam-id.component';
import { UserButtonComponent } from './cards/user-button.component';
import { ExamUsersComponent } from './dials/exam-users.component';
import { ExamPlacesComponent } from './dials/exam-places.component';
import { AppDocumentComponent } from './cards/app-document.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FileDropModule,
    ExamRoutingModule
  ],
  declarations: [
    ExamsComponent,
    ExamDirective, ExamComponent,
    ExamIdComponent, UserButtonComponent, ExamUsersComponent, ExamPlacesComponent, AppDocumentComponent,
    StateE01Component, StateE02Component, StateE03Component, StateE04Component,
    StateT01Component, StateT02Component, StateT03Component,
 ],
  entryComponents: [
    ExamComponent,
    ExamIdComponent, UserButtonComponent, ExamUsersComponent, ExamPlacesComponent, AppDocumentComponent,
    StateE01Component, StateE02Component, StateE03Component, StateE04Component,
    StateT01Component, StateT02Component, StateT03Component,
  ],
  exports: []
})
export class ExamModule { }
