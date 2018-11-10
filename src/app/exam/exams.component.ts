import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, RouterEvent
} from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { UserService } from '../user';
import { BrwService, TextsService, IBrwRow } from '../shared/services';
import * as textdata from './exams.component.json';
import * as users from '../user/users.json';
import * as clients from '../user/clients.json';
import * as examinators from '../user/examinators.json';
import * as panelbuttons from '../panelbuttons.json';

import { ExaminationsDialogComponent } from './examination/examinations-dialog.component';
import { EvaluationsDialogComponent } from './evaluation/evaluations-dialog.component';
import { TrainingsDialogComponent } from './training/trainings-dialog.component';
import { DocumentsDialogComponent } from './document/documents-dialog.component';

@Component({
  selector: 'exams',
  templateUrl: './exams.component.html'
})
export class ExamsComponent implements OnDestroy {
  private _onLngChng: Subscription;
  private _lngSub: Subscription;
  protected panelType: string
  protected panelWidth;

  public labels = {};
  public oid = 'user';
  public uuid: string;
  public access = {};
  public examtype: string = 'req';


  get service(): BrwService {
    return this._service;
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    private _modalConfig: NgbModalConfig,
    private _modalService: NgbModal,
  ) {
    let textlib = [textdata, clients, examinators, users, panelbuttons];
    this._modalConfig.backdrop = false; this._modalConfig.keyboard = false;
    this.labels = texts.toObject(textlib, _user.lng);
    this.access = _user.getAccess();
    this.uuid = this._service.getUUID(this.oid);
    _service.register(this, this.uuid);

    this._lngSub = this._onLngChng = this._user.getLngChng().subscribe(lng => {
      this.labels = this.texts.toObject(textlib, lng);
      _service.doLngChng(lng);
    });

    this.selectPanelType();

    _router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.selectPanelType(this.examtype);
        this._service.doRefresh(this.oid, this.uuid, {
          'parentId': this.parentId, 'examtype': this.examtype
        });
      }
    });

    setTimeout(() => {
      this._service.doRefresh(this.oid, this.uuid, {
        'parentId': this.parentId, 'examtype': this.examtype
      });
    }, 500)
  }

  ngOnDestroy() {
    if (this._lngSub) this._lngSub.unsubscribe();
  }

  rowClick(rowEvent) {
  }

  rowDoubleClick(rowEvent) {
  }

  public parentId: string;
  public rowChanged(lastrow: IBrwRow) {
    this.parentId = (lastrow.row ? lastrow.row.usr : undefined);
  }


  public poid: string = '';

  public get qparam() {
    return {
      'parentId': this.parentId, 'examtype': this.examtype
    }
  }

  public selectPanelType(type?: string) {
    this.panelType = type;
    switch (type) {
      case 'btnUsers':
        this.poid = 'usradr';
        break;
      case 'btnClients':
        this.poid = 'cliadrs';
        break;
      default:
        this.panelType = 'btnMembers'
        this.poid = this.oid;
    }
    this.selectPanelWidth();
  }

  public selectPanelWidth() {
    if (this.examtype == 'adm' || this.examtype == 'lpes' || this.examtype == 'lprs' || this.examtype == 'lpts' || this.panelType !== 'btnMembers') {
      this.panelWidth = { left: 60, right: 40 };
    } else {
      this.panelWidth = { left: 100, right: 0 };
    }
  }


  public showExaminationsDialog(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(ExaminationsDialogComponent, { size: 'lg' });
      modalRef.componentInstance.lodaData(id, this);
    }
  }

  public showEvaluationsDialog(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(EvaluationsDialogComponent, { size: 'lg' });
      modalRef.componentInstance.lodaData(id, this);
    }
  }

  public showTrainingsDialog(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(TrainingsDialogComponent, { size: 'lg' });
      modalRef.componentInstance.lodaData(id, this);
    }
  }

  public showDocumentsDialog(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(DocumentsDialogComponent);
      modalRef.componentInstance.lodaData(id, this);
    }
  }




  
}
