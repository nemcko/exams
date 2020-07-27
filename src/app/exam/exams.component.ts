import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, RouterEvent
} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { UserService } from '../user';
import { BrwService, TextsService, IBrwRow } from '../shared/services';
import * as textdata from './exams.component.json';
import * as users from '../user/users.json';
import * as clients from '../user/clients.json';
import * as examinators from '../user/examinators.json';
import * as examination from '../user/examination.json';
// import * as assignment from '../user/assignment.json';
import * as evaluation from '../user/evaluvation.json';
import * as panelbuttons from '../panelbuttons.json';

import { ExamComponent } from './core/ctrl.component';

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
  public oid = 'exams';
  public uuid: string;
  public access = {};
  // public examtype: string = 'exa';


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
    @Inject(DOCUMENT) private _document,
  ) {
    let textlib = [textdata, clients, examination, evaluation, examinators, users, panelbuttons];
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
    // this.examtype = this._route.snapshot.firstChild.url[0].path;

    _router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        // this.examtype = this._route.snapshot.firstChild.url[0].path;
        // this.selectPanelType(this.examtype);
        // this.qparam = {
        //   'parentId': this.parentId, 'examtype': this.examtype
        // }
        this.refresh();
      }
    });

    setTimeout(() => {
      this.refresh();
    }, 500);

    // _document.getElementById('el');
  }

  ngOnDestroy() {
    if (this._lngSub) this._lngSub.unsubscribe();
  }

  rowClick(rowEvent) {
  }

  rowDoubleClick(rowEvent) {
    // this.showDetail(rowEvent.row.id);
  }

  public parentId: string;
  public rowChanged(lastrow: IBrwRow) {
    // this.parentId = (lastrow.row ? lastrow.row.id : undefined);
    this.parentId = (lastrow.row ? lastrow.row.usr : undefined);
    // this.qparam = {
    //   'parentId': this.parentId, 'examtype': this.examtype
    // }

  }


  public poid: string = '';
  // public qparam = {
  //   'parentId': this.parentId, 'examtype': this.examtype
  // }

  // public get qparam() {
  //   return {
  //     'parentId': this.parentId, 'examtype': this.examtype
  //   }
  // }

  protected exafilter = {
    'typeact': true,
    'typeexa': true,
    'typetra': true,
    'lpe': false,
    'lpr': false,
    'lpt': false
  };

  public setExaFilter(evnt, ftype) {
    switch (ftype) {
      case 'typeact':
        this._document.getElementById('flt-typeact')['checked'] = this.exafilter['typeact'] = true;
        this._document.getElementById('flt-typeall')['checked'] = !this.exafilter['typeact']
        break;
      case 'typeall':
        this._document.getElementById('flt-typeall')['checked'] = !(this.exafilter['typeact'] = false);
        this._document.getElementById('flt-typeact')['checked'] = this.exafilter['typeact']
        break;
      default:
        this.exafilter[ftype] = evnt.target.checked;
    }
    // alert(JSON.stringify(this.exafilter))
    this.refresh();
  }

  public refresh() {
    this._service.doRefresh(this.oid, this.uuid, {
      'parentId': this.parentId,
      // 'examtype': this.examtype,
      'exafilter': this.exafilter,
    });
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
    // if (this.examtype == 'adm' || this.examtype == 'lpes' || this.examtype == 'lprs' || this.examtype == 'lpts' || this.panelType !== 'btnMembers') {
    //   this.panelWidth = { left: 60, right: 40 };
    // } else {
      this.panelWidth = { left: 100, right: 0 };
    // }
  }

  public showDocumentsDialog(id: string) {
    const modalRef = this._modalService.open(ExamComponent, { size: 'lg' });
    modalRef.componentInstance.lodaData(this, id);
  }

  public deleteDocument(id: string) {
    let self = this;
    let crudcmd = Object.assign({}, { oid: this.oid, id: id, cid: 'delete' });
    this._service.upsert(crudcmd).subscribe(
      body => {
        this.refresh();
      }
    )
  }



}
