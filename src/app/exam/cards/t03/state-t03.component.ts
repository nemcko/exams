import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IExaCtrl, IExaCardCmd, IExaCardButtons } from '../../core/ctrldef';
import * as textdata from './state-t03.component.json';
import * as languages from '../../../languages.json';

import { ApiModel } from '../../../shared/api.model';
import { ExamComponent } from '../../core/ctrl.component';

@Component({
  selector: 't03',
  templateUrl: './state-t03.component.html'
})
export class StateT03Component implements IExaCtrl, OnInit, OnDestroy {
  @Input() objLbl = [textdata, languages];
  @Input() labels = {};
  @Input() cardcode: string;
  @Input() access: any;
  @Input() parentCtrl: ExamComponent;
  @Input() data: ApiModel.IExamination;
  @Input() fb: FormBuilder;
  @Input() cardForm: FormGroup;
  @Input() cmdsub?: any;
  @Input() doCommand?: any;

  public submitted = false;
  public lprchngreErr: boolean = false;

  private _cardcmdsub: Subscription;
  ngOnInit() {
    console.log('subscribe');
    this._cardcmdsub = this.cmdsub.subscribe((cmds: IExaCardCmd | [IExaCardCmd]) => {
      if (cmds) {
        let cmdproc = (cmd: IExaCardCmd) => {
          console.log(cmd.code);

          switch (cmd.code) {
            case 'onSubmit':
              // this.onSubmit(cmd.data);
              break;
            case 'onCancel':
              // this.onCancel();
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
    this.initForm();
  }

  ngOnDestroy() {
    if (this._cardcmdsub) {
      console.log('unsubscribe');
      this._cardcmdsub.unsubscribe();
    }
  }

  public getDocUrl(docId: string, type: string): string {
    return this.parentCtrl.getDocUrl(docId, type)
  }

  public get f() { return this.cardForm.controls; }


  public initForm() {
    switch (this.cardcode) {
      case 't03a': this.cardForm = this.fb.group({
        lprchngre: [this.data.lprchngre, [Validators.maxLength(65)]],
        lprreal: [this.data.lprplaned, [Validators.required]],
      });
        break;
      default: this.cardForm = this.fb.group({
        lprrate: [this.data.lprrate],
        lprrat1: [this.data.lprrat1, [Validators.required]],
        lprcom1: [this.data.lprcom1, [Validators.maxLength(255)]],
        lprrat2: [this.data.lprrat2, [Validators.required]],
        lprcom2: [this.data.lprcom2, [Validators.maxLength(255)]],
        lprrat3: [this.data.lprrat3, [Validators.required]],
        lprcom3: [this.data.lprcom3, [Validators.maxLength(255)]],
        lprrat4: [this.data.lprrat4, [Validators.required]],
        lprcom4: [this.data.lprcom4, [Validators.maxLength(255)]],
        lprrat5: [this.data.lprrat5, [Validators.required]],
        lprcom5: [this.data.lprcom5, [Validators.maxLength(255)]],
      });
        break;
    }
  }

  public getData() {
    let formdata = this.cardForm.getRawValue();
    switch (this.cardcode) {
      case 't03a':
        return {
          lprreal: formdata.lprreal.usr,
          lprchngre: formdata.lprchngre,
        };
      case 't03b':
        return {
          lprrate: this.getRate(),
          lprrat1: formdata.lprrat1,
          lprcom1: formdata.lprcom1,
          lprrat2: formdata.lprrat2,
          lprcom2: formdata.lprcom2,
          lprrat3: formdata.lprrat3,
          lprcom3: formdata.lprcom3,
          lprrat4: formdata.lprrat4,
          lprcom4: formdata.lprcom4,
          lprrat5: formdata.lprrat5,
          lprcom5: formdata.lprcom5,
        };
    }
  }

  public isValid(usrsvc) {
    let frame = this.cardForm.controls;
    this.submitted = true;

    switch (this.cardcode) {
      case 't03a':
        if (
          (
            this.data.lprplaned.usr !== frame['lprreal'].value['usr']
          ) && frame['lprchngre'].value == ''
        ) {
          this.lprchngreErr = true;
          usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['lprchngre'] + '" ', title: this.labels['lprchngre'] });
          return false;
        }
        break;
      case 't03b':
        let err = false;
        for (let iseq of ['1', '2', '3', '4', '5']) {
          if (!frame['lprrat' + iseq].value) {
            err = err || true;
            usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['lprrat' + iseq] + '" ', title: this.labels['lprrat' + iseq] });
          }
        }
        return !err;
    }
    this.lprchngreErr = false;
    return true;
  }

  public getRate() {
    return Math.min(
      parseInt(document.getElementById('ratevalue1')['value']),
      parseInt(document.getElementById('ratevalue2')['value']),
      parseInt(document.getElementById('ratevalue3')['value']),
      parseInt(document.getElementById('ratevalue4')['value']),
      parseInt(document.getElementById('ratevalue5')['value'])
    );
  }

}
