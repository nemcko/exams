import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG, NgOption } from '@ng-select/ng-select';

import { DataTableModule } from './components/data-table';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrwComponent } from './components/browse/brw.component';
import { BrwtitleComponent } from './components/browse/brwtitle.component';
import { BrwcolDirective } from './components/browse/brwcol.directive';
import { BrwpageComponent } from './components/browse/brwpage.component';
import { PgtitleComponent } from './components/pgtitle/pgtitle.component';
import { PgpanelComponent } from './components/pgpanel/pgpanel.component';
import { PgviewComponent } from './components/pgview/pgview.component';
import { PgactionComponent } from './components/pgaction/pgaction.component';
import { PgaddlgComponent } from './components/pgaddlg/pgaddlg.component';
import { PgalertComponent } from './components/pgalert/pgalert.component';
import { FieldValidatorDirective } from './components/field-validator.directive';
import { ShowErrorsDirective } from './components/frmfld/show-errors.directive';
import { FrmInputComponent } from './components/frmfld/frm-input.component';
import { FrmCheckgoxComponent } from './components/frmfld/frm-checkgox.component';
import { FrmErrorsComponent } from './components/frmfld/frm-errors.component';
import { WebcamComponent } from './components/webcam/webcam/webcam.component';

import { FrmfldComponent } from './components/frmfld/frmfld.component';
import { FldInputComponent } from './components/frmfld/fld-input.component';
import { FldLabeledComponent } from './components/frmfld/fld-labeled.component';

import { MinPipe, PixelConverter, PercentageConverter, DropdownDirective, FocusDirective } from './components/directives';

import { FieldValidatorService } from './services/field-validator.service';
import { StateService } from './services/state.service';
import { CrudService } from './services/crud.service';
import { TextsService } from './services/texts.service';
import { ApiService } from './services/api.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { FrmSelectComponent } from './components/frmfld/frm-select.component';



const MODULES = [
  CommonModule,
  FormsModule,
  NgSelectModule,
  DataTableModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  PgtitleComponent,
  PgpanelComponent,
  PgviewComponent,
  PgactionComponent,
  PgaddlgComponent,
  PgalertComponent,
  BrwComponent,
  BrwtitleComponent,
  BrwpageComponent,
  FrmInputComponent,
  FrmCheckgoxComponent,
  FrmErrorsComponent,
  FrmfldComponent,
  FldInputComponent,
  FldLabeledComponent,
  FrmSelectComponent,
  WebcamComponent,
];
const DIRECTIVES = [
  ShowErrorsDirective,
  FieldValidatorDirective,
  BrwcolDirective,
  DropdownDirective
];
const PIPES = [
  PixelConverter,
  PercentageConverter,
  MinPipe,
  FocusDirective,
];
const ENTRY_COMPONENTS = [
]
const PROVIDERS = [
  {
    provide: NG_SELECT_DEFAULT_CONFIG,
    useValue: {
      notFoundText: 'Custom not found'
    }
  },
  FieldValidatorService,
  StateService,
  CrudService,
  TextsService,
  ApiService,
  AuthGuard,
  AuthService,
  CanDeactivateGuard
];
@NgModule({
  imports: [
    ...MODULES,
    NgbModule.forRoot()
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
}) export class SharedModule { }