import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AsyncValidatorFn, AsyncValidator, Validator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { IConfig, APP_CONFIG } from '../config';
import { StateService } from './state.service';

export interface ICrudCmd {
  uuid?: string;
  oid?: string;
  cid?: string;
  id?: string,
  offset?: number;
  limit?: number;
  qparams?: any;
}
export interface ICrudAndData extends ICrudCmd {
  uuid?: string;
  oid?: string;
  cid?: string;
  id?: string,
  offset?: number;
  limit?: number;
  brwFieldName?: string;
  brwFieldValue?: string;
  brwSortBy?: string;
  brwSortAsc?: boolean;
  count?: number;
  pages?: number;
  items?: Array<any>,
  payload?: Array<any>,
  rowid?: string;
  row?: any;
  viewpar?: ICrudCmd;
}

export interface ICrudExec {
  oid: string;
  uuid: string;
  cid: string;
  payload?: any;
  qparams?: any;
  viewpar?: ICrudCmd;
}

export interface IBrwRow {
  oid?: string;
  uuid?: string;
  rowid?: string;
  qparams?: any;
  row: any;
}


function paramsToQueryString(cfg: IConfig, params: ICrudAndData): string {
  let result = [];

  if (params.uuid != null) {
    result.push(['uuid', params.uuid]);
  }
  if (params.cid != null) {
    result.push(['cid', params.cid]);
  }
  if (params.id != null) {
    result.push(['id', params.id]);
  }
  if (params.offset != null) {
    result.push(['offset', params.offset]);
  }
  if (params.limit != null) {
    result.push(['limit', params.limit]);
  }
  if (params.brwFieldName != null) {
    result.push(['field', params.brwFieldName]);
  }
  if (params.brwFieldValue != null) {
    result.push(['value', params.brwFieldValue]);
  }
  if (params.brwSortBy != null) {
    result.push(['sort', params.brwSortBy]);
  }
  if (params.brwSortAsc != null) {
    result.push(['order', params.brwSortAsc ? 'ASC' : 'DESC']);
  }
  let url: string = cfg.apiUri + '/'
    + (params.oid ? params.oid : 'cmd');
  return url + '?' + result.map(param => param.join('=')).join('&');
}

function paramsToUrlString(params: ICrudCmd, token?: string): string {
  let url: string = this.config.apiUri + '/'
    + (params.oid ? params.oid : '-')
    + (params.id ? '/' + params.id : (params.offset == undefined ? '/1' : (isNaN(parseInt(' ' + params.offset)) ? '' : '/' + params.offset)))
    + (params.limit ? '/' + params.limit : (params.offset ? '/10' : ''))
    + (params.cid ? '/' + params.cid : '')
    ;
  return url;
}

@Injectable({ providedIn: 'root' })
export class CrudService {
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private _http: HttpClient;
  private _state: StateService;
  private _config: IConfig;

  constructor(
    @Inject(APP_CONFIG) config: IConfig,
    http: HttpClient,
    state: StateService
  ) {
    this._http = http;
    this._state = state;
    this._config = config;
  }

  public get config(): IConfig {
    return this._config;
  }

  public get state(): StateService {
    return this._state;
  }

  public get http(): HttpClient {
    return this._http;
  }

  public getUUID(oid: string) {
    return this._state.toUUID(this._state.md5(oid));
  }

  public query(params: ICrudAndData) {
    return this._http.get(paramsToQueryString(this._config, params));
  }

  public validate(params: ICrudAndData) {
    return this._http.get(paramsToQueryString(this._config, params));
  }

  public get(cmd: ICrudCmd) {
    return this._http.get(paramsToUrlString(cmd), this.httpOptions);
  }

  public post(cmd: ICrudCmd, data: any) {
    return this._http.post(paramsToUrlString(cmd), JSON.stringify(data), this.httpOptions);
  }

  public put(cmd: ICrudCmd, data: any) {
    return this._http.put(paramsToUrlString(cmd), JSON.stringify(data), this.httpOptions);
  }

  public delete(cmd: ICrudCmd) {
    return this._http.delete(paramsToUrlString(cmd), this.httpOptions);
  }

  public getReceivedItems(body: any, data: ICrudAndData): boolean {
    try {
      let xdata: any = body.json();
      if (xdata.items) {
        data.offset = xdata.offset;
        data.limit = xdata.limit;
        data.count = xdata.count;
        data.items = xdata.items;
      }
    } catch (err) {
      return false;
    }
    return true;
  }

  public getReceivedData<T>(body: any): T[] {
    let xdata: T[] = [];
    try {
      xdata = body;//.json();
    } catch (err) {
      return null;
    }
    return xdata;
  }

}
