import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { UserService } from '../user';
import { TextsService, BrwService, ICrudCmd } from '../shared/services';
import * as textdata from './address-dialog.component.json';
import * as panelbuttons from '../panelbuttons.json';

import { ApiModel } from '../shared/api.model';

@Component({
  selector: 'dlgexadocs',
  templateUrl: './address-dialog.component.html',
  styles: []
})
export class AddressDialogComponent {
  public labels = {};
  public latitude: number = 48.99823049999999;
  public longitude: number = 18.17737790000001;
  public lng: string;
  protected oladdress: ApiModel.IOlAddress = <ApiModel.IOlAddress>{};
  protected form: FormGroup;

  public setFormGroup(form: FormGroup) {
    this.form = form;
  }

  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
    private _modalService: NgbModal,
  ) {
    this.labels = texts.toObject([textdata, panelbuttons], _user.lng);
    this.lng = _user.lng;
  }

  public setAddress(addr: ApiModel.IOlAddress) {
    this.oladdress = addr;
  }
  
  public saveAddress() {
    this.form.setValue({
      street: this.oladdress.street,
      house_number: this.oladdress.house_number,
      zip: this.oladdress.postcode,
      city: this.oladdress.city,
      state: this.oladdress.country,
      longitude: this.oladdress.lon,
      latitude: this.oladdress.lat
    });
    this.activeModal.close('Close click');
  }
}
