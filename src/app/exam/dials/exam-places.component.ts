import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../../shared/services';
import * as textdata from './exam-places.component.json';
import * as addresses from '../../user/addresses.json';
import * as panelbuttons from '../../panelbuttons.json';

import { ApiModel } from '../../shared/api.model';
import { ExaCtrl } from '../core/ctrldef';
import { ExamComponent } from '../core/ctrl.component';
import { AddressDetailComponent } from '../../address/address-detail.component';

@Component({
  templateUrl: './exam-places.component.html'
})
export class ExamPlacesComponent {
  private _id;
  public uuid: string;
  private _refrUuid: string;
  public labels = {};
  public oid = '';
  public access: {};

  get service(): BrwService {
    return this._service;
  }

  protected field: string;
  protected cardCtrl: ExaCtrl;

  private _parentId: string = '';
  @Input()
  set parentId(val: string) {
    this._parentId = val;
  }
  get parentId(): string {
    return this._parentId;
  }

  protected parentQparams: any;

  protected get qparams() {
    return { commandId: 'places', clientId: 'ffdsgdfg' };
  }




  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
    private _modalService: NgbModal,
  ) {
    this.labels = texts.toObject([addresses, textdata, panelbuttons], _user.lng);
    this.access = _user.getAccess();

    this.oid = 'examdials';
    this.uuid = this._refrUuid = this._service.getUUID('examdials%places');
    this._service.register(this, this.uuid);
  }

  public setParent(field: string, card: ExaCtrl, qparam: any) {
    this.field = field;
    this.cardCtrl = card;
    this.parentQparams = qparam;
  }

  protected addItem(item) {

    let place: ApiModel.IExaPlace = {
      id: item.id,
      name: item.state + ', ' + item.zip + ', ' + item.city + (item.street ? ', ' + item.street : '') + (item.house_number ? ', ' + item.house_number : '')
    }

    this.cardCtrl['f'][this.field].patchValue(place, { onlySelf: true, emitEvent: true });
    this.activeModal.close('Close click');
  }

  protected appendItem() {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(AddressDetailComponent, { size: 'lg' });
      modalRef.componentInstance.lodaData('', this, this._refrUuid);
    }
  }

}
