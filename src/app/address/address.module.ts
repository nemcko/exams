import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { SharedModule } from '../shared/shared.module'

import { UserModule } from '../user/user.module'

import { AddressRoutingModule } from './address-routing.module';
import { AddressListComponent } from './address-list.component';
import { AddressDetailComponent, AddressDeleteComponent } from './address-detail.component';
import { AddUserAddressComponent } from './add-user-address.component';
import { AddClientAddressComponent } from './add-client-address.component';
import { UserAddressComponent } from './user-address.component';
import { ClientAddressComponent } from './client-address.component';
import { AddressDialogComponent } from './address-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    AddressRoutingModule
  ],
  declarations: [
    AddressListComponent,
    AddressDetailComponent, AddressDeleteComponent,
    AddUserAddressComponent,
    AddClientAddressComponent,
    UserAddressComponent,
    ClientAddressComponent,
    AddressDialogComponent,
  ],
  entryComponents: [
    AddressDetailComponent, AddressDeleteComponent,
    AddUserAddressComponent,
    AddClientAddressComponent,
    AddressDialogComponent,
  ],
  exports: [
    UserModule,
  ]

})
export class AddressModule { }
