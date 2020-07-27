/// <reference path="../../shared/json.d.ts"/>
import { Injectable } from '@angular/core';
import * as textdata from './texts.service.json';
import * as brwdata from '../components/browse/brw.component.json';
import * as brwpgdata from '../components/browse/brw.component.json';
import * as languages from '../../languages.json';

@Injectable({ providedIn: 'root' })
export class TextsService {
  private _lng: string = 'en';
  private _lngobj: any;
  private _lngobjLng: string = '';

  constructor() { }

  checkOwnProperty(obj: any, propertyName: string) {
    return (obj && (typeof obj == "object" || typeof obj == "function") &&
      Object.prototype.hasOwnProperty.call(obj, propertyName))
      ? true : false;
  }

  getDefaultObject(obj: any, callback: (any)) {
    if (obj && (typeof obj == "object" || typeof obj == "function") &&
    typeof obj.hasOwnProperty && obj['default']) {
      callback(obj['default']);
    } else {
      callback(obj);
    }
  }


  mergeObjects(texts: any): any {
    if (texts instanceof Array) {
      const newObj = {};
      for (const obj of texts) {
        this.getDefaultObject(obj, (defobj: any) => {
          for (const key in defobj) {
            newObj[key] = defobj[key];
          }
        })
      }
      return newObj;
    } else {
      return texts;
    }
  }

  toDataObject(texts: any, lng?: string) {
    let target = {};

    if (!lng) lng = (this._lng ? this._lng : 'en');
    this._lng = lng;

    for (let prop in this.mergeObjects(texts)) {
      this.getDefaultObject(texts,(defobj: any) => {
        for (const key in defobj) {
          target[key] = defobj[key][lng] || '';
        }
        // target[prop] = obj[prop][lng] || '';
      })
    }
    return target;
  }

  toObject(texts: any, lng?: string) {
    let target = {};
    let btarget = {};

    let txts = this.mergeObjects(texts);
    if (!lng) lng = (this._lng ? this._lng : 'en');
    this._lng = lng;


    for (let prop in brwpgdata) {
      btarget[prop] = brwpgdata[prop][lng] || '';
    }
    for (let prop in brwdata) {
      btarget[prop] = brwdata[prop][lng] || '';
    }
    for (let prop in textdata) {
      btarget[prop] = textdata[prop][lng] || '';
    }
    for (let prop in txts) {
      this.getDefaultObject(txts, (defobj: any) => {
        for (const key in defobj) {
          target[key] = defobj[key][lng] || '';
        }
        // target[prop] = obj[prop][lng] || '';
      })
    }
    return target;
  }

  toArray(texts: any, lng?: string) {
    let labels = this.toObject(texts, lng);
    return Object.keys(labels)
      .map(function (k) {
        return { name: k, label: labels[k] };
      });
  }

  toNames(texts: any, lng?: string) {
    let labels = this.toObject(this.mergeObjects(texts), lng);
    return Object.keys(labels)
      .map(function (k) {
        return { k };
      });
  }

  toLabels(texts: any, lng?: string) {
    let labels = this.toObject(this.mergeObjects(texts), lng);
    return Object.keys(labels)
      .map(function (k) {
        return labels[k];
      });
  }

  languageObject(lng?: string) {
    if (!lng) lng = (this._lng ? this._lng : 'en');
    let lngs = languages['lngs'][lng].reduce(function (result, item, index) {
      result[item.lng] = item.name;
      return result;
    }, {});
    return lngs;
  }

  getLanguages(lng?: string): Array<{ id: string, name: string }> {
    if (!this._lngobj || this._lngobjLng !== lng) {
      this._lngobjLng = lng;
      this._lngobj = this.languageObject(lng);
    }
    return Object.keys(this._lngobj).map(key => ({ id: key, name: (this._lngobj[key] ? this._lngobj[key] : key) }));
  }

  toNgSelect(value: string, lng?: string) {
    if (!this._lngobj) this._lngobj = this.languageObject(lng);
    let lngobj = this._lngobj;
    let list = (value ? value.split(',').map(function (k) {
      if (!lngobj[k]) lngobj[k] = `(${k})`;
      return k;
    })
      : '');
    return list;
  }

  fromNgSelect(text: any, lng?: string): string {
    return text.join(',');
  }

}
