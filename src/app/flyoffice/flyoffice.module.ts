import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { SharedModule } from '../shared/shared.module'

import { FlyofficeRoutingModule } from './flyoffice-routing.module';
import { FlyofficeListComponent } from './flyoffice-list.component';
import { FlyofficeDetailComponent,FlyofficeDeleteComponent } from './flyoffice-detail.component';
import { AddFlyAddressComponent } from './add-address.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FlyofficeRoutingModule
  ],
  declarations: [
    FlyofficeListComponent, 
    FlyofficeDetailComponent,FlyofficeDeleteComponent,
    AddFlyAddressComponent,
  ],
  entryComponents: [
    FlyofficeListComponent, 
    FlyofficeDetailComponent, FlyofficeDeleteComponent,
    AddFlyAddressComponent,
  ],
})
export class FlyofficeModule { }
