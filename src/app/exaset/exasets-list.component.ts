import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, RouterEvent,ParamMap
} from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { UserService } from '../user';
import { BrwService, TextsService, IBrwRow } from '../shared/services';
import * as textdata from './exasets-list.component.json';
import * as users from '../user/users.json';
import * as clients from '../user/clients.json';
import * as examinators from '../user/examinators.json';
import * as panelbuttons from '../panelbuttons.json';

import { ExasetsDetailComponent } from './exasets-detail.component';
import { AddExaminerComponent } from './add-examiner.component';
import { MembersComponent } from './members.component';
import { AddMemberComponent } from './add-member.component';
import { AddClientComponent } from './add-client.component';
import { AddUserComponent } from './add-user.component';

@Component({
  selector: 'exaset-list',
  templateUrl: './exasets-list.component.html'
})
export class ExasetsListComponent implements OnInit, OnDestroy {
  private _onLngChng: Subscription;
  private _lngSub: Subscription;
  protected panelType: string
  protected panelWidth;

  public labels = {};
  public oid = 'exagrps/list';
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
    this.examtype = this._route.snapshot.firstChild.url[0].path;

    _router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.examtype = this._route.snapshot.firstChild.url[0].path;
        this.selectPanelType(this.examtype);
        // this.qparam = {
        //   'parentId': this.parentId, 'examtype': this.examtype
        // }
        this._service.doRefresh(this.oid, this.uuid, {
          'parentId': this.parentId, 'examtype': this.examtype
        });
      }
    });

    // setTimeout(() => {
    //   this._service.doRefresh(this.oid, this.uuid, {
    //     'parentId': this.parentId, 'examtype': this.examtype
    //   });
    // }, 500)
  }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    if (this._lngSub) this._lngSub.unsubscribe();
  }

  rowClick(rowEvent) {
  }

  rowDoubleClick(rowEvent) {
    this.showDetail(rowEvent.row.id);
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

  public get qparam() {
    return {
      'parentId': this.parentId, 'examtype': this.examtype
    }
  }


  public showDetail(id) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(ExasetsDetailComponent);
      modalRef.componentInstance.lodaData(id, this);
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

  public deleteItemalertdlg: HTMLElement;
  private _deleteItem: string;
  protected alertExaminerDlg(item) {
    if (this.access['adm']) {
      this._deleteItem = item.usr;
      this.deleteItemalertdlg = document.getElementById('deleteExaminertdlg');
      $(this.deleteItemalertdlg).modal({ show: true, backdrop: false, keyboard: false });
    }
  }

  doDeleteExaminer(action: string) {
    if (action == 'YES') {
      let crudcmd = Object.assign({}, { 'oid': this.oid, 'cid': 'delexa', 'qparams': this.qparam });
      this._service.upsert(crudcmd, { userId: this._deleteItem, examtype: this.examtype }).subscribe(
        body => {
          this._service.refresh(this.uuid, this.qparam);
        }
      )
    }
  }


  public addExaminator() {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(AddExaminerComponent);
      modalRef.componentInstance.setParent(this.poid, this.parentId, this.qparam);
    }
  }

  public addMember() {
    if (this.access['adm']) {
      if (!this.parentId) return;
      if (!(this.examtype == 'adm' || this.examtype == 'lpes' || this.examtype == 'lprs' || this.examtype == 'lpts' || this.panelType !== 'btnMembers')) return;
      const modalRef = this._modalService.open(AddMemberComponent);
      modalRef.componentInstance.setParent(this.poid, this.parentId, this.qparam);
    }
  }

  public addUser() {
    if (this.access['adm']) {
      if (!this.parentId) return;
      const modalRef = this._modalService.open(AddUserComponent);
      modalRef.componentInstance.setParent(this.poid, this.parentId, this.qparam);
    }
  }

  public addClient() {
    if (this.access['adm']) {
      if (!this.parentId) return;
      const modalRef = this._modalService.open(AddClientComponent);
      modalRef.componentInstance.setParent(this.poid, this.parentId, this.qparam);
    }
  }

}
