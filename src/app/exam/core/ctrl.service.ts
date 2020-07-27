import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as exa from './ctrldef';
import { UserService } from '../../user';

import { StateE01Component } from '../cards/e01/state-e01.component';
import { StateE02Component } from '../cards/e02/state-e02.component';
import { StateE03Component } from '../cards/e03/state-e03.component';
import { StateE04Component } from '../cards/e04/state-e04.component';
import { StateT01Component } from '../cards/t01/state-t01.component';
import { StateT02Component } from '../cards/t02/state-t02.component';

import { ApiModel } from '../../shared/api.model';

@Injectable({
  providedIn: 'root'
})
export class ExaCtrlService {
  private _cards: exa.IExamination;
  private _data: ApiModel.IExamination;
  public cmdsub = new Subject<exa.IExaCardCmd>();

  constructor(
    private _user: UserService,
  ) {
    this._data = <ApiModel.IExamination>{}
  }

  public getNext(card: string): string {
    let acc = this._user.getAccess();
    let lastkey = '';
    let availcards = {};

    if ((card + '')[0] == 'e') {
      availcards['e01a'] = 'e01b';
      if (acc.lpes || acc.adm) {
        availcards['e01b'] = 'e02a';
      }
      if (acc.lpes || acc.lpe || acc.adm) {
        availcards['e02a'] = 'e02b';
        availcards['e02b'] = 'e02c';
        availcards['e02c'] = 'e02d';
        availcards['e02d'] = 'e03a';
        lastkey = 'e02d';
      }
      if (acc.lprs || acc.lpr || acc.adm) {
        availcards['e03a'] = 'e03b';
        availcards['e03b'] = 'e04a';
        availcards['e04a'] = 'e04b';
        availcards['e04b'] = '';
        lastkey = 'e04b';
      }
    } else {
      availcards['t01a'] = 't01b';
      if (acc.lpes || acc.adm) {
        availcards['t01b'] = 't02a';
      }
      if (acc.lpes || acc.lpe || acc.adm) {
        availcards['t02a'] = '';
        lastkey = 't02b';
      }
    }
    availcards[lastkey] = '';
    if (card in availcards)
      return availcards[card];
    else
      return Object.keys(availcards)[0];
  }

  public createCards(state: string) {
    let lastseq = parseInt(state.replace(/[^\d.]/g, ''));
    let acc = this._user.getAccess();
    this._cards = {};
    if ((state + '')[0] == 'e') {
      if (lastseq == 1)
        this._cards[state] = this.getCtrlComponent('e01');
      else {
        if (!state) {
          state = this.data.exnum.substr(0, 1).toLowerCase();
          lastseq = 100;
        }
        this._cards[state[0] + '01'] = this.getCtrlComponent('e01');
      }
      if (acc.lpes || acc.lpe || acc.adm) {
        if (lastseq == 2)
          this._cards[state] = this.getCtrlComponent('e02');
        else if (lastseq > 2)
          this._cards[state[0] + '02'] = this.getCtrlComponent('e02');
      }
      if (acc.lprs || acc.lpr || acc.adm) {
        if (lastseq == 3)
          this._cards[state] = this.getCtrlComponent('e03');
        else if (lastseq > 3)
          this._cards[state[0] + '03'] = this.getCtrlComponent('e03');
        if (this.data.appreal.usr) {
          if (lastseq == 4)
            this._cards[state] = this.getCtrlComponent('e04');
          else if (lastseq > 4)
            this._cards[state[0] + '04'] = this.getCtrlComponent('e04');
        }
      }
    } else {
      if (lastseq == 1)
        this._cards[state] = this.getCtrlComponent('t01');
      else {
        if (!state) {
          state = this.data.exnum.substr(0, 1).toLowerCase();
          lastseq = 100;
        }
        this._cards[state[0] + '01'] = this.getCtrlComponent('t01');
      }
      if (acc.lpes || acc.lpe || acc.adm) {
        if (lastseq == 2)
          this._cards[state] = this.getCtrlComponent('t02');
        else if (lastseq > 2)
          this._cards[state[0] + '02'] = this.getCtrlComponent('t02');
      }
    }
  }

  protected getCtrlComponent(pref: string): exa.ExaCtrl {
    let ctrl: exa.ExaCtrl;
    switch (pref) {
      case 'e01': ctrl = new exa.ExaCtrl(1, StateE01Component);
        break;
      case 'e02': ctrl = new exa.ExaCtrl(2, StateE02Component);
        break;
      case 'e03': ctrl = new exa.ExaCtrl(3, StateE03Component);
        break;
      case 'e04': ctrl = new exa.ExaCtrl(4, StateE04Component);
        break;
      case 't01': ctrl = new exa.ExaCtrl(1, StateT01Component);
        break;
      case 't02': ctrl = new exa.ExaCtrl(2, StateT02Component);
        break;
    }
    return ctrl;
  }

  public getCardTitle(prefix: string, card: string): string {
    let txt = '';
    switch (card) {
      case 'e01a':
      case 'e01b':
      case 't01a':
      case 't01b':
      case '': break;
      default:
        txt = `${prefix}${this._data.exnum || ''}`;
    }
    return txt;
  }

  public get cards(): exa.IExamination {
    return this._cards;
  }

  public get ctrls(): exa.ExaCtrlList {
    let controls = this._cards || {};
    return Object.keys(controls).map(function (code) {
      return { code, ctrl: controls[code] };
    });
  }


  public getComponentKey(card: string): string {
    if (card in this._cards)
      return card;
    else
      return Object.keys(this._cards)[0];
  }

  public getComponent(card: string) {
    return this._cards[this.getComponentKey(card)].component;
  }

  public get data(): ApiModel.IExamination {
    return this._data;
  }

  public set data(val: ApiModel.IExamination) {
    this._data = val;
  }

  public doCommand(cmd: exa.IExaCardCmd) {
    this.cmdsub.next(cmd);
  }

  public clearCommends() {
    this.cmdsub.next();
  }

  public getCommand(): Observable<exa.IExaCardCmd> {
    return this.cmdsub.asObservable();
  }

}
