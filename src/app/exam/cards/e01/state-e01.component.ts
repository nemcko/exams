import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { IExaCtrl, IExaCardCmd, IExaCardButtons } from '../../core/ctrldef';
import * as textdata from './state-e01.component.json';
import * as languages from '../../../languages.json';

import { ApiModel } from '../../../shared/api.model';
import { ExamComponent } from '../../core/ctrl.component';
import { ExamPlacesComponent } from '../../dials/exam-places.component';

@Component({
  selector: 'e01',
  templateUrl: './state-e01.component.html'
})
export class StateE01Component implements IExaCtrl, OnInit, OnDestroy {
  @Input() objLbl = [textdata, languages];
  @Input() labels = {};
  @Input() cardcode: string;
  @Input() access: any;
  @Input() parentCtrl: ExamComponent;
  @Input() data: ApiModel.IExamination;
  @Input() fb: FormBuilder;
  @Input() cmdsub?: any;
  @Input() doCommand?: any;

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

  public cardForm: FormGroup;

  public get f() { return this.cardForm.controls; }

  public initForm() {
    this.cardForm = this.fb.group({
      exnum: [this.data.exnum, [Validators.required, Validators.maxLength(45)]],
      lng: [this.data.lng, [Validators.required, Validators.maxLength(3)]],
      planplace: this.fb.group({
        id: [this.data['planplace']['id']],
        name: [this.data['planplace']['name'], [Validators.required]]
      }),
      applicant: [this.data.applicant, [Validators.required]],
      company: [this.data.company],
      lpeplaned: [this.data.lpeplaned, [Validators.required]],
      planeddt: [this.data.planeddt, [Validators.required]],
      assignedby: [this.data.assignedby],
      lperespon: [this.data.lperespon],
    });
  }

  public getData() {
    let formdata = this.cardForm.getRawValue();
    return {
      exnum: formdata.exnum,
      lng: formdata.lng,
      planplace: formdata.planplace.name,
      idplanplace: formdata.planplace.id,
      applicant: formdata.applicant.usr,
      idcompany: formdata.company.id,
      lpeplaned: formdata.lpeplaned.usr,
      planeddt: formdata.planeddt,
      assignedby: formdata.assignedby.usr,
      lperespon: formdata.lperespon.usr,
    };
  }

  public isValid(usrsvc): boolean {
    let frame = this.cardForm.controls;
    if (!frame['applicant'].value['usr']) {
      usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['applicant'] + '" ', title: this.labels['applicant'] });
      return false;
    }
    if (!frame['lpeplaned'].value['usr']) {
      usrsvc.showToast({ type: 'error', message: this.labels['invalidvaluefor'] + '"' + this.labels['lpeplaned'] + '" ', title: this.labels['lpeplaned'] });
      return false;
    }
    return true;
  }

  public showExamPlaces(name: string) {
    const modalRef = this.parentCtrl.modalService.open(ExamPlacesComponent);
    modalRef.componentInstance.setParent(name, this, '');
  }


}
