import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { FileDropModule } from 'ngx-file-drop';
import { SharedModule } from '../shared/shared.module'

import { ExamedRoutingModule } from './examed-routing.module';
import { ExamedListComponent } from './examed-list.component';
import { ExamedDetailComponent } from './examed-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FileDropModule,
    ExamedRoutingModule
  ],
  declarations: [
    ExamedListComponent, 
    ExamedDetailComponent
  ],
  entryComponents: [
    ExamedDetailComponent
  ]
})
export class ExamedModule { }
