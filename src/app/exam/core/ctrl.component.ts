import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
declare let $: any;

import { UserService } from '../../user';
import { TextsService, BrwService, ApiService, ICrudCmd, ICrudExec } from '../../shared/services';
import * as textdata from './ctrl.json';
import * as users from '../../user/users.json';
import * as clients from '../../user/clients.json';
import * as examinators from '../../user/examinators.json';
import * as examination from '../../user/examination.json';
import * as assignment from '../../user/assignment.json';
import * as evaluation from '../../user/evaluvation.json';
import * as notifycation from '../../user/notifycation.json';
import * as validators from '../../validators.json';
import * as panelbuttons from '../../panelbuttons.json';

import { ExamDirective } from './ctrl.directive';
import { IExamination, IExaCtrl, ExaCtrl, ExaCtrlList, IExaCtrlListItem, IExaCardCmd, IExaCardButtons } from './ctrldef';
import { ExaCtrlService } from './ctrl.service';

import { ApiModel } from '../../shared/api.model';

@Component({
  templateUrl: './ctrl.component.html'
})
export class ExamComponent implements OnInit {
  private _id;
  private _uuid: string;
  private _refrUuid: string;
  private _parent: any;
  public arrLabels = [textdata, panelbuttons, users, examinators, clients, assignment, examination, evaluation, notifycation, validators];
  public labels = {};
  public oid = 'exams';
  public access: {};
  public hasDesc: boolean;
  public disabledButtons: IExaCardButtons;
  public visibleButtons: IExaCardButtons;
  public exam: IExamination;
  public viewstate: string;
  public viewcard: string;
  public curcard: IExaCtrl;

  @Input() ads: ExaCtrl[];
  @ViewChild(ExamDirective) adHost: ExamDirective;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _api: ApiService,
    private _user: UserService,
    private _service: BrwService,
    private _exasvc: ExaCtrlService,
    public texts: TextsService,
    private _formBuilder: FormBuilder,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
    this.access = _user.getAccess();
    this.resetButtons();
    this._uuid = this._refrUuid = this._service.getUUID(this.oid);
  }

  ngOnInit() {
    this._exasvc.getCommand().subscribe((cmds: IExaCardCmd | [IExaCardCmd]) => {
      if (cmds) {
        let cmdproc = (cmd: IExaCardCmd) => {
          switch (cmd.code) {
            case 'closeDlg':
              this.closeDlg();
              break;
            case 'resetButtons':
              this.resetButtons();
              break;
            case 'setviewcard':
              this.setviewcard(cmd.data);
              break;
            case 'loadComponent':
              this.loadComponent(cmd.data);
              break;
            case 'enableButtons':
              this.enableButtons(cmd.data);
              break;
            case 'showButtons':
              this.showButtons(cmd.data);
              break;
          }
        }

        if (cmds instanceof Array) {
          for (const cmd of cmds) {
            cmdproc(cmd);
          }
        } else {
          cmdproc(cmds);
        }
      }
    });
  }

  public resetButtons() {
    this.disabledButtons = {
      close: false,
      btnCancel: false,
      btnBack: false,
      btnsave: false,
      btnsaveexit: false,
      btnsavenext: false,
    };
    this.visibleButtons = {
      close: true,
      btnCancel: false,
      btnBack: false,
      btnsave: true,
      btnsaveexit: true,
      btnsavenext: true,
    }
  }

  public lodaData(parent: any, examId: string, uuid = '', callback = null) {
    let self = this;
    self._parent = parent;
    self._refrUuid = (uuid ? uuid : self._uuid);
    self._service.cmd(Object.assign({}, { oid: self.oid, id: examId })).subscribe(
      body => {
        self._id = body.items['id'];
        // self._service.setReceivedData(self._exasvc.data, body.items);

        let defdata = {
          id: '1',
          exnum: 'E0000001',
          state: 'e01a',
          stateview: '',
          lng: 'en',
          exatype: 'exa',
          flyingrules: 'VFR',
          applicant: { usr: '', firstname: '', lastname: '', faceid: '' },
          company: { id: '', name: '' },
          assignedby: { usr: '', firstname: '', lastname: '', faceid: '' },
          lpeplaned: { usr: '', firstname: '', lastname: '', faceid: '' },
          lperespon: { usr: '', firstname: '', lastname: '', faceid: '' },
          planplace: { id: '', name: '' },
          planeddt: new Date(),

          realplace: { id: '', name: '' },
          realdt: new Date(),
          lpereal: { usr: '', firstname: '', lastname: '', faceid: '' },
          lpechngre: '',
          usetstnr: '',
          userecnr: '',
          usevidnr: '',
          lperate: 0,
          lperat1: 0,
          lpecom1: '',
          lperat2: 0,
          lpecom2: '',
          lperat3: 0,
          lpecom3: '',
          lperat4: 0,
          lpecom4: '',
          lperat5: 0,
          lpecom5: '',
          testdoc: '',
          testaudio: '',
          testvideo: '',

          lprreal: { usr: '', firstname: '', lastname: '', faceid: '' },
          lprrespon: { usr: '', firstname: '', lastname: '', faceid: '' },
          lprchngre: '',
          lprrate: 0,
          lprrat1: 0,
          lprcom1: '',
          lprrat2: 0,
          lprcom2: '',
          lprrat3: 0,
          lprcom3: '',
          lprrat4: 0,
          lprcom4: '',
          lprrat5: 0,
          lprcom5: '',

          appreal: { usr: '', firstname: '', lastname: '', faceid: '' },
          apprespon: { usr: '', firstname: '', lastname: '', faceid: '' },
          appchngre: '',
          apprate: 0,
          apprat1: 0,
          appcom1: '',
          apprat2: 0,
          appcom2: '',
          apprat3: 0,
          appcom3: '',
          apprat4: 0,
          appcom4: '',
          apprat5: 0,
          appcom5: '',
        }

        // for (let prop in defdata) {
        //   if (!self._exasvc.data.hasOwnProperty(prop) || self._exasvc.data[prop] === null)
        //     self._exasvc.data[prop] = defdata[prop];
        // }

        for (let prop in body.items) {
          defdata[prop] = body.items[prop];
        }
        self._exasvc.data = defdata;

        if (callback) callback();
        else {
          self.viewstate = self.viewcard = self._exasvc.data.state;
          self._exasvc.createCards(self.viewcard);
          self.loadComponent(self.viewcard);
          parent.refresh();
        }
      }
    )
  }

  public setviewcard(card: string) {
    this.loadComponent(card);
  }

  public getDocUrl(id: string, type: string) {
    return this._api.getApiUrl(`appdocument/${this._api.docId(id)}/${type}`);
  }

  public loadComponent(card: string) {
    let cardObj: any = this._exasvc.getComponent(card);
    this.resetButtons();
    if (cardObj) {
      let componentFactory = this._componentFactoryResolver.resolveComponentFactory(cardObj);
      let viewContainerRef = this.adHost.viewContainerRef;

      this._exasvc.clearCommends();
      viewContainerRef.clear();

      let componentRef = viewContainerRef.createComponent(componentFactory);
      let lbls = [...this.arrLabels];
      this.curcard = <IExaCtrl>componentRef.instance;
      card = this._exasvc.getComponentKey(card);

      if (this.curcard.objLbl instanceof Array)
        lbls.push(...this.curcard.objLbl);
      else
        lbls.push(this.curcard.objLbl);

      this.curcard.cardcode = card;
      this.curcard.labels = this.labels = this.texts.toObject(lbls, this._user.lng);
      this.curcard.access = this.access;
      this.curcard.parentCtrl = this;
      this.curcard.data = this._exasvc.data;
      this.curcard.fb = this._formBuilder;
      this.curcard.cmdsub = this._exasvc.cmdsub;
      this.curcard.doCommand = (cmd) => { this.curcard.cmdsub.next(cmd); }

      this.viewcard = card;

      // this.showButtons({
      //   btnsaveexit: (card==='e01a' && (this.access['lpes']  || this.access['adm'])) && true
      // })
      // this.enableButtons({
      //   btnsaveexit: (card==='e01a' && (this.access['lpes']  || this.access['adm'])) && true
      // })
      this.visibleButtons.btnsavenext =
        ((card == 'e01a' || card == 't01a') && (this.access['lpes'] || this.access['lpe'] || this.access['adm'])) ||
        ((card == 'e01b' || card == 't01b') && (this.access['lpes'] || this.access['adm'])) ||
        ((card + '    ').substr(1, 2) == '02' && (this.access['lpes'] || this.access['lpe'] || this.access['adm'])) ||
        ((card + '    ').substr(1, 2) == '03' && (this.access['lprs'] || this.access['lpr'] || this.access['adm'])) ||
        ((card + '    ').substr(1, 2) == '04' && (this.access['lprs'] || this.access['lpr'] || this.access['adm']));

    } else {
      if (this.access['lpes'] || this.access['lpe']) {
        this.loadComponent('');
      } else {
        this.closeDlg();
        this._service.refresh(this._parent.uuid);
      }
    }
  }


  public selectCard(code: string) {
    this.loadComponent(code);
    // this.doCommand({ code: 'setCardTitle', data: this.labels[this.viewcard] })
  }

  public get ctrlTitle(): string {
    if (this.viewcard)
      return `${this.labels['title' + this.data.exatype]} ${this._exasvc.getCardTitle(this.labels['exanr'], this.viewcard)}`;
    else
      return '';
  }

  public get exacards(): ExaCtrlList {
    return this._exasvc.ctrls;
  }

  public get data(): any {
    return this._exasvc.data;
  }

  public enableButtons(buttons: object) {
    for (let prop in buttons) {
      if (prop in this.disabledButtons) {
        this.disabledButtons[prop] = !buttons[prop];
      }
    }
  }

  public showButtons(buttons: object) {
    for (let prop in buttons) {
      if (prop in this.visibleButtons) {
        this.visibleButtons[prop] = buttons[prop];
      }
    }
  }

  public backData($event) {
    // this.resetButtons();
    this.loadComponent(this.viewcard);
  }

  public cancelData($event) {
    this._exasvc.cmdsub.next({ code: 'onCancel' })
  }

  public saveData(bClose: boolean = false) {
    this._exasvc.cmdsub.next({
      code: 'onSubmit',
      data: bClose
    })
  }

  public saveExit() {
    this.saveData(true);
  }

  public closeDlg() {
    this._exasvc.cmdsub.next({ code: 'wfcmdunsubscribe' })
    this.activeModal.close('Close click');
  }

  public dismissDlg() {
    this._exasvc.cmdsub.next({ code: 'wfcmdunsubscribe' })
    this.activeModal.dismiss('Cross click')
  }

  public saveNext() {
    if (!this.curcard.isValid(this._user)) return;
    if (this.curcard['cardForm'].invalid) {
      for (let ctrlname in this.curcard['cardForm'].controls) {
        if (this.curcard['cardForm'].controls[ctrlname].invalid) {
          this._user.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels[ctrlname] + '" ', title: this.labels[ctrlname] })
          return;
        }
      }
    }
    let self = this;
    let record = this.curcard.getData();
    // alert(JSON.stringify(record))
    let crudcmd = Object.assign({}, { oid: this.oid, id: this._exasvc.data.id, cid: this.viewcard });
    this._service.upsert(crudcmd, record).subscribe(
      body => {
        this.viewstate = this.viewcard = this._exasvc.getNext(this._exasvc.data.state);
        if (this.viewcard && (body.items[0]['canview'] == '1' || body.items[0]['adm'])) {
          if (body.items[0]['state']) {
            this._exasvc.createCards(this.viewcard);
            this.lodaData(this._parent, this._id, this._refrUuid, () => {
              this.loadComponent(this.viewcard);
              this._exasvc.data.state = this.viewcard;
              self._parent.refresh();
            })
          } else {
            this.closeDlg();
            self._parent.refresh();
          }
        } else {
          this.closeDlg();
          self._parent.refresh();
        }
      }, error => {
        this._user.showToast({ type: 'info', message: this.labels['notifaftexam'], title: this.labels['title'] })
        // this._user.showToast({type: 'warning',message:'dlsvjwblvilwvk',title:'QQQQQ'})
      }
    )
  }

}
