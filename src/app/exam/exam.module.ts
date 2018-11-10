import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { SharedModule } from '../shared/shared.module'

import { ExamRoutingModule } from './exam-routing.module';
import { ExamsComponent } from './exams.component';
import { EvaluationsDialogComponent } from './evaluation/evaluations-dialog.component';
import { ExaminationsDialogComponent } from './examination/examinations-dialog.component';
import { TrainingsDialogComponent } from './training/trainings-dialog.component';
import { DocumentsDialogComponent } from './document/documents-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    ExamRoutingModule
  ],
  declarations: [
    ExamsComponent, 
    EvaluationsDialogComponent, 
    ExaminationsDialogComponent, 
    TrainingsDialogComponent, 
    DocumentsDialogComponent, 
  ],
  entryComponents: [
    DocumentsDialogComponent, 
    ExaminationsDialogComponent,
    TrainingsDialogComponent,
    EvaluationsDialogComponent
  ],
  exports: []
})
export class ExamModule { }
