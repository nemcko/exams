import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { SharedModule } from '../shared/shared.module'
import { FileDropModule } from 'ngx-file-drop';

import { UserRoutingModule } from './user-routing.module';
import { UsrlistComponent } from './usrlist/usrlist.component';
import { UserComponent } from './user.component';
import { UsrBasicDataComponent } from './usrlist/usr-basic-data.component';
import { TestuiComponent } from './testui/testui.component';
import { ProfileComponent } from './profile/profile.component';
import { DetailComponent } from './profile/detail/detail.component';
import { DocumentsComponent } from './profile/documents/documents.component';
import { ExaminationsComponent } from './profile/examinations/examinations.component';
import { EvaluationsComponent } from './profile/evaluations/evaluations.component';
import { TrainingsComponent } from './profile/trainings/trainings.component';
import { PhotoDlgComponent } from './photo/photo-dlg.component';
import { UsrDocumentsComponent } from './usrlist/usr-documents.component';
import { UsrDocumentComponent } from './usrlist/usr-document.component';
import { UsrLanguagesComponent } from './usrlist/usr-languages.component';
import { UsrLanguageComponent } from './usrlist/usr-language.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FileDropModule,
    UserRoutingModule
  ],
  declarations: [
    UsrlistComponent,
    UserComponent,
    UsrBasicDataComponent,
    ProfileComponent,
    DetailComponent,
    DocumentsComponent,
    ExaminationsComponent,
    EvaluationsComponent,
    TrainingsComponent,
    TestuiComponent,
    PhotoDlgComponent,
    UsrDocumentsComponent,
    UsrDocumentComponent,
    UsrLanguagesComponent,
    UsrLanguageComponent,
  ],
  entryComponents: [
    UsrDocumentComponent,
    UsrLanguageComponent,
    UsrBasicDataComponent,
    PhotoDlgComponent,
  ],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsrBasicDataComponent
  ]
})
export class UserModule { }
