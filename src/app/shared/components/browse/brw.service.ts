import { Inject, Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs';
import { StateService } from '../../services/state.service';
import { CrudService, ICrudCmd, ICrudAndData, ICrudExec, IBrwRow } from '../../services/crud.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IConfig, APP_CONFIG } from '../../config';

@Injectable({ providedIn: 'root' })
export class BrwService extends CrudService {
  private _commandSource = new Subject<ICrudAndData>();
  public doCommand(cmd: ICrudAndData) {
    this._commandSource.next(cmd);
  }

  public onCommand$ = this._commandSource.asObservable();


  private _notifySource = new Subject<ICrudAndData>();

  public doNotify(cmd: ICrudAndData) {
    this._notifySource.next(cmd);
  }

  public onNotify$ = this._notifySource.asObservable();

  constructor(
    @Inject(APP_CONFIG) config: IConfig,
    http: HttpClient,
    state: StateService,
    private _router: Router,
  ) {
    super(config, http, state);
  }

  public md5(e) {
    return this.state.md5(e);
  }

  public get uniqueID() {
    return this.state.uniqueID;
  }

  private _registrator: {} = <object>{};
  public register(sourceObj: any, uuid: string) {

    if (!this._registrator[uuid]) this._registrator[uuid] = sourceObj;
    if (!sourceObj._starter) {
      sourceObj._starter = this.state.get(uuid);
    }
    if (!sourceObj._lastCrudCmd && sourceObj.oid) {
      sourceObj._lastCrudCmd = { oid: sourceObj.oid };
    }
  }

  private _dataSources: {} = <object>{};
  public registerSource(uuid: string, sourceObj: any) {

    if (!this._dataSources[uuid])
      this._dataSources[uuid] = sourceObj;
    else {
      this._dataSources[uuid] = sourceObj;
    }
  }

  public releaseSource(uuid: string) {
    if (this._dataSources[uuid]) {
      delete this._dataSources[uuid];
    }
  }



  protected getCmdUrl(cmd: ICrudAndData, cfg: IConfig): string {
    if (cmd.oid.indexOf('/') === -1) {
      if (cmd.id) {
        if (cmd.id && cmd.cid) {
          return `${cfg.apiUri}/${cmd.oid}/${cmd.id}/${cmd.cid}`;
        } else {
          return `${cfg.apiUri}/${cmd.oid}/${cmd.id}`;
        }
      } else {
        if (cmd.cid && cmd.cid[0] == '#') {
          if (cmd.cid == '#exec')
            return `${cfg.apiUri}/${cmd.oid}/${cmd.qparams.commandId}`;
          else
            return `${cfg.apiUri}/${cmd.oid}/list`;
        } else {
          if (cmd.cid) {
            return `${cfg.apiUri}/${cmd.oid}/${cmd.cid}`;
          } else {
            return `${cfg.apiUri}/${cmd.oid}`;
          }
        }
      }
    } else {
      cmd.oid = cmd.oid.replace(/^\/+/g, '')
      if (cmd.cid && cmd.cid[0] == '#') {
        if (cmd.cid == '#exec')
          return `${cfg.apiUri}/${cmd.oid}/${cmd.qparams.commandId}`;
        else
          return `${cfg.apiUri}/${cmd.oid}`;
      } else {
        if (cmd.cid) {
          return `${cfg.apiUri}/${cmd.oid}/${cmd.cid}`;
        } else {
          return `${cfg.apiUri}/${cmd.oid}`;
        }
      }
    }
  }

  protected prepareSendData(cmd: ICrudAndData, data?: any, upd: boolean = false): ICrudAndData {
    let sendData: ICrudAndData = this._addTokenToData();
    if (!cmd.id) {
      if (cmd.uuid != null) sendData['uuid'] = cmd.uuid;
      if (cmd.cid != null) sendData['cid'] = cmd.cid;
      if (cmd.offset != null) sendData['offset'] = cmd.offset;
      if (cmd.limit != null) sendData['limit'] = cmd.limit;
      if (cmd.id != null) sendData['id'] = cmd.id;

      if (cmd.brwFieldName != null) {
        sendData['brwFieldName'] = cmd.brwFieldName;
        sendData['brwFieldValue'] = cmd.brwFieldValue;
      }

      if (cmd.brwSortBy != null) {
        sendData['brwSortBy'] = cmd.brwSortBy;
        sendData['brwSortAsc'] = (cmd.brwSortAsc ? true : false);
      }

      if (cmd.qparams) sendData['qparams'] = cmd.qparams;

      if (data && !cmd.id) sendData[(upd ? 'payload' : 'items')] = data;

      this.saveState(sendData);
    } else {
      sendData['payload'] = data;
    }

    return sendData;
  }

  public cmd(cmd: ICrudAndData, data?: any) {
    return this.http.post<ICrudAndData>(
      this.getCmdUrl(cmd, this.config),
      JSON.stringify(this.prepareSendData(cmd, data)),
    );
  }

  public upsert(cmd: ICrudAndData, data?: any) {
    return this.http.post<ICrudAndData>(
      this.getCmdUrl(cmd, this.config),
      JSON.stringify(this.prepareSendData(cmd, data, true)),
    );
  }

  public exec(exepar: ICrudExec) {
    let state = this.state.get(exepar.uuid);
    let cmd = <ICrudAndData>{};
    cmd.oid = exepar.oid;
    cmd.uuid = exepar.uuid;
    if (exepar.cid) cmd.cid = exepar.cid;
    if (exepar.qparams) {
      cmd.qparams = exepar.qparams;
      if (cmd.qparams.commandId)
        delete cmd.qparams['commandId'];
    }
    if (state) {
      if (!exepar.cid && state.cid != null) cmd.cid = state.cid;
      if (state.offset != null) cmd.offset = state.offset;
      if (state.limit != null) cmd.limit = state.limit;
      if (state.id != null) cmd.id = state.id;

      if (state.brwFieldName != null) {
        cmd.brwFieldName = state.brwFieldName;
        cmd.brwFieldValue = state.brwFieldValue;
      }

      if (state.brwSortBy != null) {
        cmd.brwSortBy = state.brwSortBy;
        cmd.brwSortAsc = state.brwSortAsc;
      }
    }
    return this.http.post<ICrudAndData>(
      this.getCmdUrl(cmd, this.config),
      JSON.stringify(this.prepareSendData(cmd, exepar.payload)),
    );
  }

  public refresh(uuid: string, qparams?: any) {
    let state = this.state.get(uuid);
    if (!state) state = {}
    state.cid = '#refresh';
    state.uuid = uuid;
    if (qparams) state.qparams = qparams;
    this.doCommand(state);
  }

  protected prepareViewPar(oid: string, uuid: string, cid: string, qparams?: any) {
    let state = null;
    if (this._registrator[uuid]) {
      let regObj = this._registrator[uuid];
      state = this.state.get(uuid);
      if (!state) state = {}
      state.cid = '#refresh';
      state.uuid = uuid;
      state.oid = oid;


      if (qparams) state.qparams = qparams;
      if (cid) {
        if (cid && !state.qparams) state['qparams'] = {};
        state.qparams['commandId'] = cid;
      }
    } else throw "Registrator has not yet been created!";
    return state;
  }

  public doRefresh(oid: string, uuid: string, qparams?: any) {
    let state = this.prepareViewPar(oid, uuid, null, qparams);
    this._registrator[uuid]._service.doCommand(state);
  }

  protected prepareCmdPar(oid: string, uuid: string, cid: string, qparams?: any): ICrudExec {
    let cmd: ICrudExec = <ICrudExec>{};
    if (this._registrator[uuid]) {
      let regObj = this._registrator[uuid];
      let state = this.state.get(uuid);
      if (!state) state = {}
      Object.assign(cmd, state);
      cmd.cid = '#exec';
      cmd.uuid = uuid;
      cmd.oid = oid;
      if (qparams) cmd.qparams = qparams;
      if (cid) {
        if (cid && !cmd.qparams) cmd['qparams'] = {};
        cmd.qparams['commandId'] = cid;
      }
    } else throw "Registrator has not yet been created!";
    return cmd;
  }

  public doExec(cmdpar: ICrudExec, viewpar?: ICrudCmd) {
    let cmd: ICrudExec = <ICrudExec>{};
    let vwcmd: ICrudExec = null;
    cmd = this.prepareCmdPar(cmdpar.oid, cmdpar.uuid, cmdpar.cid, cmdpar.qparams);
    if (cmdpar.payload) cmd.payload = cmdpar.payload;
    if (viewpar) cmd.viewpar = this.prepareViewPar(viewpar.oid, viewpar.uuid, viewpar.cid, viewpar.qparams);
    this._dataSources[cmdpar.uuid].execute(cmd);

  }

  public search(uuid: string, value: string, field?: string) {
    let state = {
      cid: '#search',
      uuid: uuid,
      brwFieldValue: value
    };
    if (field) state['brwFieldName'] = field;
    this.doCommand(state);
  }

  public doLngChng(lng: string) {
    this.doCommand({
      cid: '#lngchng'
    });
  }

  private _rowChanges = <IBrwRow>{};
  public doRowChanged(row: IBrwRow) {
    this._rowChanges[row.uuid] = {
      rowid: row.rowid,
      qparams: row.qparams,
      row: row.row
    };
    this.doCommand({
      cid: '#rowchanged',
      oid: row.oid,
      uuid: row.uuid,
      rowid: row.rowid,
      qparams: row.qparams,
      row: row.row
    });
  }

  public getLastRowChange(uuid: string): IBrwRow {
    return (this._rowChanges[uuid] ? this._rowChanges[uuid] : { rowid: undefined, row: undefined });
  }

  private _addTokenToData(data?: any): ICrudAndData {
    if (!data) data = {};
    if (this.state.token) {
      data['token'] = this.state.token;
    }
    return data;
  }

  public setReceivedData(self: any, body: any) {
    try {
      if (self._lastCrudCmd) {
        if (body.oid) self._lastCrudCmd.oid = body.oid;
        self._lastCrudCmd.offset = body.offset;
        self._lastCrudCmd.limit = body.limit;
        self._lastCrudCmd.count = body.count;
        self._lastCrudCmd.pages = body.pages;

        if (body.brwFieldName != null) {
          self._lastCrudCmd.brwFieldName = body.brwFieldName;
          self._lastCrudCmd.brwFieldValue = body.brwFieldValue;
        }

        if (body.brwSortBy != null) {
          self._lastCrudCmd.brwSortBy = body.brwSortBy;
          self._lastCrudCmd.brwSortAsc = (body.brwSortAsc ? true : false);
        }

        if (body.uuid != null) {
          self._lastCrudCmd.uuid = body.uuid;
        }

        self._items = body.items;

        this.saveState(body);
      } else {
        Object.assign(self, body);
      }

    } catch (err) {
      return null;
    }
  }

  protected saveState(cmd: ICrudAndData) {
    let save = false;

    switch (cmd.cid) {
      case '#search':
      case '#refresh':
      case '#first':
      case '#prev':
      case '#next':
      case '#last':
        save = true;
        break;
      default:
        break;
    }

    if (save && cmd.uuid) {
      let state = {};
      if (cmd.oid != null) state['oid'] = cmd.oid;
      if (cmd.cid != null) state['cid'] = cmd.cid;
      if (cmd.offset != null) state['offset'] = cmd.offset;
      if (cmd.limit != null) state['limit'] = cmd.limit;

      if (cmd.brwFieldName != null) {
        state['brwFieldName'] = cmd.brwFieldName;
        state['brwFieldValue'] = cmd.brwFieldValue;
      }

      if (cmd.brwSortBy != null) {
        state['brwSortBy'] = cmd.brwSortBy;
        state['brwSortAsc'] = (cmd.brwSortAsc ? true : false);
      }
      this.state.set(cmd.uuid, state)
    }

  }

  logInMe() {
    this.navigateTo('/login');
  }

  navigateTo(uri: string) {
    let navigationExtras: NavigationExtras = {
      preserveQueryParams: true,
      preserveFragment: true
    };
    this._router.navigate([uri], navigationExtras);
  }


}
