import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IExaCtrl, IExaCardCmd, IExaCardButtons } from '../../core/ctrldef';
import * as textdata from './state-t02.component.json';
import * as languages from '../../../languages.json';

import { ApiModel } from '../../../shared/api.model';
import { ExamComponent } from '../../core/ctrl.component';
import { ExamPlacesComponent } from '../../dials/exam-places.component';

@Component({
  selector: 't02',
  templateUrl: './state-t02.component.html'
})
export class StateT02Component implements IExaCtrl, OnInit, OnDestroy {
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
  public lpechngreErr: boolean = false;

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
      case 't02a': this.cardForm = this.fb.group({
        lpechngre: [this.data.lpechngre, [Validators.maxLength(65)]],
        realplace: this.fb.group({
          id: [this.data['planplace']['id']],
          name: [this.data['planplace']['name'], [Validators.required]]
        }),
        lpereal: [this.data.lpeplaned, [Validators.required]],
        realdt: [this.data.planeddt, [Validators.required]],
      });
        break;
      case 't02b': this.cardForm = this.fb.group({
        usetstnr: [this.data.usetstnr, [Validators.maxLength(15), Validators.required]],
        userecnr: [this.data.userecnr, [Validators.maxLength(15)]],
        usevidnr: [this.data.usevidnr, [Validators.maxLength(15)]],
      });
        break;
      case 't02c': this.cardForm = this.fb.group({
        lperate: [this.data.lperate],
        lperat1: [this.data.lperat1, [Validators.required]],
        lpecom1: [this.data.lpecom1, [Validators.maxLength(255)]],
        lperat2: [this.data.lperat2, [Validators.required]],
        lpecom2: [this.data.lpecom2, [Validators.maxLength(255)]],
        lperat3: [this.data.lperat3, [Validators.required]],
        lpecom3: [this.data.lpecom3, [Validators.maxLength(255)]],
        lperat4: [this.data.lperat4, [Validators.required]],
        lpecom4: [this.data.lpecom4, [Validators.maxLength(255)]],
        lperat5: [this.data.lperat5, [Validators.required]],
        lpecom5: [this.data.lpecom5, [Validators.maxLength(255)]],
      });
        break;
      case 't02d': this.cardForm = this.fb.group({
        testdoc: [this.data.testdoc],
        testaudio: [this.data.testaudio],
        testvideo: [this.data.testvideo],
      });
        break;
      default:
        this.cardForm = this.fb.group({
          lperate: [this.data.lperate],
          lperat1: [this.data.lperat1, [Validators.required]],
          lpecom1: [this.data.lpecom1, [Validators.maxLength(255)]],
          lperat2: [this.data.lperat2, [Validators.required]],
          lpecom2: [this.data.lpecom2, [Validators.maxLength(255)]],
          lperat3: [this.data.lperat3, [Validators.required]],
          lpecom3: [this.data.lpecom3, [Validators.maxLength(255)]],
          lperat4: [this.data.lperat4, [Validators.required]],
          lpecom4: [this.data.lpecom4, [Validators.maxLength(255)]],
          lperat5: [this.data.lperat5, [Validators.required]],
          lpecom5: [this.data.lpecom5, [Validators.maxLength(255)]],
        });
        break;
    }
  }

  public getData() {
    let formdata = this.cardForm.getRawValue();
    switch (this.cardcode) {
      case 't02a':
        return {
          lpechngre: formdata.lpechngre,
          realplace: formdata.realplace.name,
          idrealplace: formdata.realplace.id,
          lpereal: formdata.lpereal.usr,
          realdt: formdata.realdt,
        };
      case 't02b':
        return {
          usetstnr: formdata.usetstnr,
          userecnr: formdata.userecnr,
          usevidnr: formdata.usevidnr,
        };
      case 't02c':
        return {
          lperate: this.getRate(),
          lperat1: formdata.lperat1,
          lpecom1: formdata.lpecom1,
          lperat2: formdata.lperat2,
          lpecom2: formdata.lpecom2,
          lperat3: formdata.lperat3,
          lpecom3: formdata.lpecom3,
          lperat4: formdata.lperat4,
          lpecom4: formdata.lpecom4,
          lperat5: formdata.lperat5,
          lpecom5: formdata.lpecom5,
        };
      case 't02d':
        return {
          testdoc: formdata.testdoc,
          testaudio: formdata.testaudio,
          testvideo: formdata.testvideo,
        };
    }
  }

  public isValid(usrsvc) {
    let bErr = false;
    let frame = this.cardForm.controls;
    this.submitted = true;

    switch (this.cardcode) {
      case 't02a':
        if (
          (
            this.data.planplace.id !== frame['realplace'].value['id'] ||
            this.data.lpeplaned.usr !== frame['lpereal'].value['usr'] ||
            this.data.planeddt !== frame['realdt'].value
          ) && frame['lpechngre'].value == ''
        ) {
          this.lpechngreErr = true;
          usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['lpechngre'] + '" ', title: this.labels['lpechngre'] });
          return false;
        }
        break;
      case 't02b':
        if (frame['usetstnr'].value == ''){
          usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['usetstnr'] + '" ', title: this.labels['usetstnr'] });
          return false;
        }
        break;
      case 't02c':{
        for (let iseq of ['1', '2', '3', '4', '5']) {
          if (!frame['lperat' + iseq].value) {
            bErr = bErr || true;
            usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['lperat' + iseq] + '" ', title: this.labels['lperat' + iseq] });
          }
        }
        return !bErr;
      }
      case 't02d':
        break;
    }
    this.lpechngreErr = false;
    return true;
  }

  public showExamPlaces(name: string) {
    const modalRef = this.parentCtrl.modalService.open(ExamPlacesComponent);
    modalRef.componentInstance.setParent(name, this, '');
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
