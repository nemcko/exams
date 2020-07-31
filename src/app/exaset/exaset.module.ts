import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { SharedModule } from '../shared/shared.module'

import { ExasetRoutingModule } from './exaset-routing.module';
import { ExasetsListComponent } from './exasets-list.component';
import { ExasetsDetailComponent } from './exasets-detail.component';
import { ClientsComponent } from './clients.component';
import { AddClientComponent } from './add-client.component';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user.component';
import { MembersComponent } from './members.component';
import { AddMemberComponent } from './add-member.component';
import { AddExaminerComponent } from './add-examiner.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    ExasetRoutingModule
  ],
  declarations: [
    ExasetsListComponent, 
    ExasetsDetailComponent, 
    ClientsComponent, 
    AddClientComponent, 
    UsersComponent, 
    AddUserComponent, 
    MembersComponent, 
    AddMemberComponent, 
    AddExaminerComponent,
  ],
  entryComponents: [
    AddClientComponent, 
    AddUserComponent,
    AddMemberComponent,
    AddExaminerComponent,
  ],
  exports: []
})
export class ExasetModule { }
