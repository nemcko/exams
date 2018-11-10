import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { SharedModule } from '../shared/shared.module'

import { ClientRoutingModule } from './client-routing.module';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user.component';
import { ClientListComponent } from './client-list.component';
import { ClientDetailComponent, ClientDeleteComponent } from './client-detail.component';
import { AddAddressComponent } from './add-address.component';
import { AddressesComponent } from './addresses.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    ClientRoutingModule
  ],
  declarations: [
    UsersComponent,
    AddUserComponent,
    ClientListComponent,
    ClientDetailComponent, ClientDeleteComponent,
    AddAddressComponent,
    AddressesComponent,
  ],
  entryComponents: [
    ClientDetailComponent, ClientDeleteComponent,
    AddUserComponent,
    AddAddressComponent,
  ],
})
export class ClientModule { }
