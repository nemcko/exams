import {
  Component, Input, Output, EventEmitter, ContentChildren, QueryList,
  TemplateRef, ContentChild, ViewChildren, OnInit, OnDestroy, AfterContentInit
} from '@angular/core';
import { throwError ,  Observable, Subscription } from 'rxjs';
import { filter, map, tap, catchError } from 'rxjs/operators';
import { StateService } from '../../services';
import { BrwcolDirective } from './brwcol.directive';
import { BrwService } from './brw.service';

import { drag } from './drag';
import { TextsService, ICrudCmd, ICrudAndData, IBrwRow } from '../../services';
import * as textdata from './brw.component.json';


export class Rowset {
  rows: any;
}

@Component({
  selector: 'brw',
  templateUrl: './brw.component.html',
  styleUrls: ['./brw.component.css'],
  providers: [BrwService]
})
export class BrwComponent implements OnInit, OnDestroy, AfterContentInit {
  private _items: Array<any> = [];
  public labels = {};
  private _uuid: string;
  private _hasOwnUUID: string = '';
  private _starter: any = null;
  private _service: BrwService;
  private _svcSubs: Subscription;

  constructor(
    private _texts: TextsService,
  ) {
    this.labels = _texts.toDataObject(textdata);
  }

  @Input() public set uuid(val: string) {
    this._hasOwnUUID = val;
    // this._uuid = this._service.getUUID(val);
  }
  public get uuid(): string {
    if (this._hasOwnUUID)
      return this._hasOwnUUID
    else
      return this._uuid;
  }


  // get doUpdate() {
  //   return this.updateData.bind(this);
  // }

  // protected updateData(cid: string, data: any) {
  //   alert(cid)
  // }

  ngOnDestroy() {
    if (!this._hasOwnUUID) this._service.state.del(this.uuid);
    this._service.releaseSource(this.objectId);
    if (this._svcSubs) this._svcSubs.unsubscribe();
  }

  @Input() title: string = '';
  @Input() tabcls: string = '';
  @Input() style: string = '';
  @Input() hasBackbutton: boolean = false;


  private _limit = 15;
  @Input()
  get limit() {
    return this._limit;
  }
  set limit(value) {
    this._limit = value;
    //this._triggerReload();
  }

  @Input() qparams: any;

  @Input()
  get service(): BrwService {
    return this._service;
  }
  set service(svc: BrwService) {
    this._service = svc;
    this._svcSubs = this._service.onCommand$.subscribe(cmd => {
      if (cmd.uuid == this.uuid) {
        if (cmd.cid == '#rowchanged' && cmd.oid == this.oid && cmd.uuid == this.uuid) {

        } else {
          switch (cmd.cid) {
            case '#search':
            case '#refresh':
            case '#first':
            case '#prev':
            case '#next':
            case '#last':
              this.reload(cmd);
              break;
            case '#exec':
              this.execute(cmd);
              break;
            case '#lngchng':
              break;
            default:
              break;
          }
        }
      }
    });

  }

  @ContentChildren(BrwcolDirective) protected columns: QueryList<BrwcolDirective>;


  public get rows() {
    return this._items;
  }

  get columnCount() {
    let count = 0;
    // count += this.indexColumnVisible ? 1 : 0;
    // count += this.selectColumnVisible ? 1 : 0;
    // count += this.expandColumnVisible ? 1 : 0;
    if (this.columns) {
      this.columns.toArray().forEach(column => {
        count += column.visible ? 1 : 0;
      });
    }
    return count;
  }

  @Input() autoReload = true;

  private _reloading = false;

  @Input()
  get oid(): string {
    return this._lastCrudCmd.oid;
  }
  set oid(value: string) {
    this._lastCrudCmd.oid = value;
    this._lastCrudCmd.offset = 0;
    // if (this.autoReload) this.reload(this._lastCrudCmd);
  }

  private _objectId: string = Math.random().toString(16).slice(-4) + Math.random().toString(16).slice(-4) +
    '-' + Math.random().toString(16).slice(-4) +
    '-' + Math.random().toString(16).slice(-4) +
    '-' + Math.random().toString(16).slice(-4) +
    '-' + Math.random().toString(16).slice(-4) + Math.random().toString(16).slice(-4) + Math.random().toString(16).slice(-4);
  public get objectId(): string {
    return this._objectId;
  }

  get reloading() {
    return this._reloading;
  }

  @Output() onReload = new EventEmitter();

  ngOnInit() {
    // console.log('COUNT:', this.columnCount);
    // if (this.columns) {
    //   this.columns.toArray().forEach(column => {
    //     console.log(column)
    //   });
    // }

    if (!this._uuid) {
      if (this._hasOwnUUID) {
        this._uuid = this._service.getUUID(this._hasOwnUUID);
      } else {
        this._uuid = this._service.state.toUUID();
      }
    }


    if (this._hasOwnUUID) {
      const state = this._service.state.get(this.uuid);
      if (state) {
        this._starter = {};
        if (state.oid) this._starter.oid = state.oid;
        this._starter.offset = state.offset;
        this._starter.limit = state.limit;

        if (state.brwFieldName != null) {
          this._starter.brwFieldName = state.brwFieldName;
          this._starter.brwFieldValue = state.brwFieldValue;
        }

        if (state.brwSortBy != null) {
          this._starter.brwSortBy = state.brwSortBy;
          this._starter.brwSortAsc = (state.brwSortAsc ? true : false);
        }

      }
    }

  }

  ngAfterContentInit() {
    // if(this.searchComponent){
    //   this.searchComponent.subscribeInput();
    // }
    if (this.autoReload) this.reload(this._lastCrudCmd);
  }


  private _lastCrudCmd: ICrudAndData = {};

  protected prepareCommand(cmd: ICrudAndData): ICrudAndData {
    let newcmd: ICrudAndData = {
      uuid: this.uuid,
      oid: cmd.oid || this._lastCrudCmd.oid,
      cid: cmd.cid || this._lastCrudCmd.cid || '#first',
      offset: cmd.offset || this._lastCrudCmd.offset || 1,
      limit: cmd.limit || this._lastCrudCmd.limit || this.limit,
    };

    if (cmd.brwFieldName) {
      newcmd.brwFieldName = cmd.brwFieldName;
      newcmd.brwFieldValue = cmd.brwFieldValue;
    }

    if (cmd.brwSortBy) {
      newcmd.brwSortBy = cmd.brwSortBy;
      newcmd.brwSortAsc = cmd.brwSortAsc;
    }


    switch (newcmd.cid) {
      case '#refresh':
      case '#prev':
      case '#next':
      case '#last':
        break;
      default:
        newcmd.offset = 1;
        break;
    }

    if (this._starter) {
      if (this._starter.oid) newcmd.oid = this._starter.oid;
      newcmd.offset = this._starter.offset;
      newcmd.limit = this._starter.limit;

      if (this._starter.brwFieldName != null) {
        newcmd.brwFieldName = this._starter.brwFieldName;
        newcmd.brwFieldValue = this._starter.brwFieldValue;
      }

      if (this._starter.brwSortBy != null) {
        newcmd.brwSortBy = this._starter.brwSortBy;
        newcmd.brwSortAsc = (this._starter.brwSortAsc ? true : false);
      }

      this._starter = null;
    }

    if (cmd.qparams) {
      newcmd['qparams'] = cmd.qparams;
    } else {
      if (this.qparams) {
        newcmd['qparams'] = this.qparams;
      }
    }
    return newcmd;
  }

  public reload(cmd: ICrudAndData) {
    this._lastrowId = undefined;
    this._reloading = true;
    this._service.registerSource(this.uuid, this);
    this._service.cmd(this.prepareCommand(cmd))
      .subscribe(
        body => {
          this._service.setReceivedData(this, body);
          this._service.doNotify(this._lastCrudCmd);
          this._reloading = false;
          this.doRowChanged((this._items && this._items.length ? this._items[0] : undefined));
        },
        err => {
          this._reloading = false;
          this.doRowChanged();
          this._service.logInMe();

          // if (err.status === 408) {
          //   this._service.logInMe();
          //   // this._appsvc.showSnackbar(err._body);
          // } else {
          //   // this._appsvc.showSnackbar(err);
          // }
        }
      )
  }

  public execute(cmd: ICrudAndData) {
    // let observable = Observable.create(observer => {
    this._lastrowId = undefined;
    this._reloading = true;
    this._service.registerSource(this.uuid, this);
    this._service.upsert(this.prepareCommand(cmd), cmd.payload)
      .subscribe(
        body => {
          this._service.setReceivedData(this, body);
          this._service.doNotify(this._lastCrudCmd);
          this._reloading = false;
          this.doRowChanged((this._items && this._items.length ? this._items[0] : undefined));
          if (cmd.viewpar) {
            this._service.doRefresh(cmd.viewpar.oid, cmd.viewpar.uuid, cmd.viewpar.qparams);
          }
          // observer.next(body);
        },
        err => {
          this._reloading = false;
          this.doRowChanged();
          // observer.complete(err);
        }
      )
    // })
    // return observable;
  }

  protected get itemCount(): number {
    return (this.rows && this.rows.length ? this.rows.length : 0)
  }




  // @ContentChild('searchBarTemplate') searchBar;
  // public brwFieldName:string;
  // @ContentChild(BrwsearchComponent) protected searchComponent: BrwsearchComponent;
  // protected getParent(): BrwComponent {
  //   return this;
  // }

  @Output() rowClick = new EventEmitter();
  protected rowClicked(row, event) {
    this.doRowChanged(row);
    this.rowClick.emit({ row, event });
  }

  @Output() rowDoubleClick = new EventEmitter();
  protected rowDoubleClicked(row, event) {
    this.doRowChanged(row);
    this.rowDoubleClick.emit({ row, event });
  }

  private _selected: boolean;

  @Output() selectedChange = new EventEmitter();

  get selected() {
    return this._selected;
  }

  set selected(selected) {
    this._selected = selected;
    this.selectedChange.emit(selected);
  }

  private _resizeInProgress = false;

  private resizeColumnStart(event: MouseEvent, column: any, columnElement: HTMLElement) {
    this._resizeInProgress = true;
    drag(event, {
      move: (moveEvent: MouseEvent, dx: number) => {
        if (this._isResizeInLimit(columnElement, dx)) {
          column.width += dx;
        } else {
          this._resizeInProgress = false;
        }
      },
    });
  }

  resizeLimit = 30;

  private _isResizeInLimit(columnElement: HTMLElement, dx: number) {
    if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit)
      // || !columnElement.nextElementSibling 
      // ||  (dx >= 0 && ((<HTMLElement> columnElement.nextElementSibling).offsetWidth + dx) <= this.resizeLimit)
    ) {
      return false;
    }
    return true;
  }

  @Output() rowChanged = new EventEmitter<IBrwRow>();

  private _lastrowId: string;
  protected doRowChanged(row?: any) {
    if (row) {
      if (this._lastrowId && this._lastrowId === this._service.md5(JSON.stringify(row))) return;
      this._lastrowId = this._service.md5(JSON.stringify(row));
    } else {
      this._lastrowId = undefined;
    }
    this.rowChanged.emit({ 'rowid': this._lastrowId, 'row': row });
    this._service.doRowChanged({
      'oid': this.oid,
      'uuid': this._uuid,
      'rowid': this._lastrowId,
      'qparams': this.qparams,
      'row': row
    })
  }
}
