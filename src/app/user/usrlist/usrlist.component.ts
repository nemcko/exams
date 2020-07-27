import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { UserService } from '../../user';
import { BrwService, TextsService, ICrudCmd, IBrwRow } from '../../shared/services';
import * as textdata from './usrlist.component.json';
import * as examinators from '../examinators.json';
import * as users from '../../user/users.json';
import * as clients from '../../user/clients.json';
import * as panelbuttons from '../../panelbuttons.json';

import { UsrBasicDataComponent } from './usr-basic-data.component';
import { PhotoDlgComponent } from '../photo/photo-dlg.component';
import { UsrLanguageComponent } from './usr-language.component';
import { UsrDocumentComponent } from './usr-document.component';

@Component({
  selector: 'usrlist',
  templateUrl: './usrlist.component.html',
  styleUrls: ['./usrlist.component.css']
})
export class UsrlistComponent implements OnInit, OnDestroy {
  private _onLngChng: Subscription;
  private _lngSub: Subscription;
  public panelType: string
  public panelWidth;
  public labels = {};
  public oid = 'user';
  public uuid: string;
  public access: {};
  protected submitted = false;

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
    let textlib = [users, clients, examinators, textdata, panelbuttons];
    this._modalConfig.backdrop = false; this._modalConfig.keyboard = false;
    // if (_route.snapshot.url.length) {
    //   this.examtype = _route.snapshot.url[0]['path'];
    // }
    this.labels = texts.toObject(textlib, _user.lng);
    this.access = _user.getAccess();
    this.uuid = this._service.getUUID(this.oid);
    _service.register(this, this.uuid);

    this._lngSub = this._onLngChng = this._user.getLngChng().subscribe(lng => {
      this.labels = this.texts.toObject(textlib, lng);
      _service.doLngChng(lng);
    });

    this.selectPanelType();

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this._lngSub) this._lngSub.unsubscribe();
  }


  rowClick(rowEvent) {
  }

  rowDoubleClick(rowEvent) {
    // this._user.setData('seluser', rowEvent.row);
    // this._router.navigate(['/users/profile']).then(nav => {
    //   this._user.setData('seluser', rowEvent.row);
    // });
    this.showBasicData(rowEvent.row.id);
  }

  public showBasicData(id) {
    const modalRef = this._modalService.open(UsrBasicDataComponent, { size: 'lg' });
    modalRef.componentInstance.lodaData(id, this);
  }

  protected exafilter = {
    'lpes': false,
    'lprs': false,
    'lpts': false,
    'lpe': false,
    'lpr': false,
    'lpt': false
  };
  public setExaFilter(evnt, ftype) {
    switch (ftype) {
      case 'lpe*':
        document.getElementById('flt-lpes')['checked'] = document.getElementById('flt-lpe')['checked'] =
          this.exafilter['lpes'] = this.exafilter['lpe'] = !(this.exafilter['lpes'] || this.exafilter['lpe'] || false)
        break;
      case 'lpr*':
        document.getElementById('flt-lprs')['checked'] = document.getElementById('flt-lpr')['checked'] =
          this.exafilter['lprs'] = this.exafilter['lpr'] = !(this.exafilter['lprs'] || this.exafilter['lpr'] || false)
        break;
      case 'lpt*':
        document.getElementById('flt-lpts')['checked'] = document.getElementById('flt-lpt')['checked'] =
          this.exafilter['lpts'] = this.exafilter['lpt'] = !(this.exafilter['lpts'] || this.exafilter['lpt'] || false)
        break;
      default:
        this.exafilter[ftype] = evnt.target.checked;
    }
    // alert(JSON.stringify(this.exafilter))
    this.refresh();
  }

  public parentId: string;
  public rowId: string;
 public rowChanged(lastrow: IBrwRow) {
    this.parentId = (lastrow.row ? lastrow.row.usr : undefined);
    this.rowId = (lastrow.row ? lastrow.row.id : undefined);
    this.qparam = {
      'userId': this.parentId,
      'exafilter': this.exafilter,
      'rowId':  this.rowId
   }
  }
  public poid: string = '';
  public qparam: any;

  public showPhoto(item) {
    if (this.access['adm']) {
      const modalRef = this._modalService.open(PhotoDlgComponent);
      modalRef.componentInstance.lodaData(item, this);
    }
  }

  public refresh(){
    this._service.doRefresh(this.oid, this.uuid, {
      'userId': this.parentId,
      'exafilter': this.exafilter,
      'rowId':  this.rowId
    });
  }

  public selectPanelType(type?: string) {
    this.panelType = type;
    switch (type) {
      case 'btnDocuments':
        this.poid = 'documents';
        break;
      case 'btnExamLang':
        this.poid = 'examlng';
        break;
      // case 'btnUsers':
      //   this.poid = 'usradr';
      //   break;
      // case 'btnClients':
      //   this.poid = 'cliadrs';
      //   break;
      default:
        this.panelType = 'btnUser'
        this.poid = this.oid;
    }
    this.selectPanelWidth();
  }

  public selectPanelWidth() {
    if (this.panelType !== 'btnUser') {
      this.panelWidth = { left: 60, right: 40 };
    } else {
      this.panelWidth = { left: 100, right: 0 };
    }
  }

  public showExamLangData(id) {
    const modalRef = this._modalService.open(UsrLanguageComponent, { size: 'sm' });
    modalRef.componentInstance.lodaData(id, this);
  }

  public showExamdocData(id) {
    const modalRef = this._modalService.open(UsrDocumentComponent);
    modalRef.componentInstance.lodaData(id, this);
  }

}
