import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IExaCtrl, IExaCardCmd, IExaCardButtons } from '../../core/ctrldef';
import * as textdata from './state-e04.component.json';
import * as languages from '../../../languages.json';

import { ApiModel } from '../../../shared/api.model';
import { ExamComponent } from '../../core/ctrl.component';

@Component({
  selector: 'e04',
  templateUrl: './state-e04.component.html'
})
export class StateE04Component implements IExaCtrl, OnInit, OnDestroy {
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
  public appchngreErr: boolean = false;

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

  public get f() { return this.cardForm.controls; }

  public initForm() {
    switch (this.cardcode) {
      case 'e04a': this.cardForm = this.fb.group({
        appreal: [this.data.appplaned, [Validators.required]],
        appchngre: [this.data.appchngre, [Validators.maxLength(65)]],
      });
        break;
      default: this.cardForm = this.fb.group({
        apprate: [this.data.apprate],
        apprat1: [this.data.apprat1, [Validators.required]],
        appcom1: [this.data.appcom1, [Validators.maxLength(255)]],
        apprat2: [this.data.apprat2, [Validators.required]],
        appcom2: [this.data.appcom2, [Validators.maxLength(255)]],
        apprat3: [this.data.apprat3, [Validators.required]],
        appcom3: [this.data.appcom3, [Validators.maxLength(255)]],
        apprat4: [this.data.apprat4, [Validators.required]],
        appcom4: [this.data.appcom4, [Validators.maxLength(255)]],
        apprat5: [this.data.apprat5, [Validators.required]],
        appcom5: [this.data.appcom5, [Validators.maxLength(255)]],
      });
        break;
    }
  }

  public getData() {
    let formdata = this.cardForm.getRawValue();
    switch (this.cardcode) {
      case 'e04a':
        return {
          appreal: formdata.appreal.usr,
          appchngre: formdata.appchngre,
        };
      case 'e04b':
        return {
          apprate: this.getRate(),
          apprat1: formdata.apprat1,
          appcom1: formdata.appcom1,
          apprat2: formdata.apprat2,
          appcom2: formdata.appcom2,
          apprat3: formdata.apprat3,
          appcom3: formdata.appcom3,
          apprat4: formdata.apprat4,
          appcom4: formdata.appcom4,
          apprat5: formdata.apprat5,
          appcom5: formdata.appcom5,
        };
    }
  }

  public isValid(usrsvc) {
    let frame = this.cardForm.controls;
    this.submitted = true;

    switch (this.cardcode) {
      case 'e04a':
        if (
          (
            this.data.appplaned.usr !== frame['appreal'].value['usr'] 
          ) && frame['appchngre'].value == ''
        ) {
          this.appchngreErr = true;
          usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['appchngre'] + '" ', title: this.labels['appchngre'] });
          return false;
        }
        break;
      case 'e04b':
        let err = false;
        for (let iseq of ['1', '2', '3', '4', '5']) {
          if (!frame['apprat' + iseq].value) {
            err = err || true;
            usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['apprat' + iseq] + '" ', title: this.labels['apprat' + iseq] });
          }
        }
        return !err;
    }
    this.appchngreErr = false;
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
