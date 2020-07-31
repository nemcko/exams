import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, ControlContainer } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { UserService } from '../../../user/user.service';

@Component({
  selector: '[frmdt]',
  template: `
  <label [for]="id">{{labels[id]}}</label>
  <div class="input-group m-0">
    <input class="form-control" 
      #inputDateElement
      [id]="id" 
      type="date"
      data-date=""
      [ngModel]="mdate"
      (ngModelChange)="changeDate($event)"      
      [attr.disabled]="readonly?'':null">
    <select class="wmmss pr-0 ml-1" [(ngModel)]="mhour" (change)="changeHours($event)" [attr.disabled]="readonly?'':null">
      <option [value]="h" *ngFor="let h of hours">{{h}}</option>
    </select>  
    <div class="input-group-append">
      <span class="input-group-text px-1">:</span>
    </div>
    <select class="wmmss" [(ngModel)]="mmin" (change)="changeMinutes($event)" [attr.disabled]="readonly?'':null">
      <option [value]="m" *ngFor="let m of minutes">{{m}}</option>
    </select>  
  </div>

  `, styles: [`
:host {  width: 100%; }
input {
  position: relative;
  width: 150px;
}

input:before {
  position: absolute;
  content: attr(data-date);
  display: inline-block;
}

input::-webkit-datetime-edit, input::-webkit-inner-spin-button, input::-webkit-clear-button {
  display: none;
}

input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0;
  opacity: 1;
}
  `]

})
export class FrmDateTimeComponent {
  @Input() labels: any;
  @Input() id: string = '';
  @Input() isRequired: boolean = false;
  @Input() frm: FormGroup;
  @Input() readonly: boolean = false;

  @ViewChild('inputDateElement') private _inputDateElement: ElementRef;

  public mdate: Date;
  public mhour: number;
  public mmin: number;
  public hours: Array<string> = [];
  public minutes: Array<string> = [];
  public datevalue: string = '';

  constructor(
    private _user: UserService,
    public controlContainer: ControlContainer,
  ) {
    let x = 0;
    while (x < 24) {
      // this.hours.push(('00' + x).slice(-2));
      this.hours.push(x.toString());
      x = x + 1;
    }
    x = 0;
    while (x < 60) {
      // this.minutes.push(('00' + x).slice(-2));
      this.minutes.push(x.toString());
      x = x + 10;
    }
  }

  public to10min(num: number) {
    return (+(num / 10).toFixed(2)) * 10;
  }

  ngOnInit() {
    if (this.frm && this.frm.controls[this.id] && this.frm.controls[this.id].value instanceof Date) {
      let datePipe = new DatePipe(this._user.lng);
      this.datevalue = datePipe.transform(this.frm.controls[this.id].value, this.labels.dateformat);
      // this.mdate = new Date(this.datevalue);
      this.mdate = new Date(this.frm.controls[this.id].value.getFullYear(), this.frm.controls[this.id].value.getMonth(), this.frm.controls[this.id].value.getDate());
      this.mhour = this.frm.controls[this.id].value.getHours();
      this.mmin = this.to10min(this.frm.controls[this.id].value.getMinutes());
      this._inputDateElement.nativeElement.setAttribute('data-date', this.datevalue);
    } else {
      if (typeof (this.frm.controls[this.id].value) === 'string' || this.frm.controls[this.id].value instanceof String) {
        let datePipe = new DatePipe(this._user.lng);
        this.datevalue = datePipe.transform(this.frm.controls[this.id].value, this.labels.dateformat);
        this.mdate = new Date(this.frm.controls[this.id].value);
        this.mhour = this.mdate.getHours();
        this.mmin = this.to10min(this.mdate.getMinutes());
        this._inputDateElement.nativeElement.setAttribute('data-date', this.datevalue);
      } else {
        this.changeDate();
        this.mhour = 0;
        this.mmin = 0;
      }
    }
  }

  public changeDate(ctrlval?: string) {
    let datePipe = new DatePipe(this._user.lng);
    if (ctrlval) {
      this.datevalue = datePipe.transform(ctrlval, this.labels.dateformat);
      this.mdate = new Date(ctrlval);
      this._inputDateElement.nativeElement.setAttribute('data-date', this.datevalue);
      this.saveValue();
    } else {
      this.datevalue = this.labels.dateformat;
      this._inputDateElement.nativeElement.setAttribute('data-date', this.datevalue)
      this.saveValue();
    }
  }

  public changeHours(val: string) {
    this.saveValue();
  }

  public changeMinutes(val: string) {
    this.saveValue();
  }

  protected saveValue() {
    let dt = this.mdate;
    if (dt) {
      dt.setHours(this.mhour);
      dt.setMinutes(this.mmin);
    }
    this.frm.controls[this.id].patchValue(dt, { onlySelf: true, emitEvent: true });
  }

}


