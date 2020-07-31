import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { UserService } from '../../user/user.service';
import { ApiModel } from '../../shared/api.model';

@Component({
  selector: 'examid',
  templateUrl: './exam-id.component.html'
})
export class ExamIdComponent {
  @Input() labels = {};
  @Input() data: ApiModel.IExaBase;
  @Input() readonly: boolean = false;
  @Input() cardcode: string = '';

  public bcollapse: boolean = true;

  constructor(
    private _user: UserService,
  ) { }

  public get selLanguage(): string {
    let self = this;
    let lng = this.labels['lngs'].filter(function (o) { return o.lng == self.data.lng; });
    return (lng ? lng[0].name : self.data.lng);
  }

  public get selRules(): string {
    let self = this;
    let rules = this.labels['accordingrules'].filter(function (o) { return o.flyingrules == self.data.flyingrules; });
    return (rules ? rules[0].name : self.data.flyingrules);
  }

  public get exalabel(): string {
    let lbl: string;

    switch (this.cardcode) {
      case 'e01': lbl = this.labels['examinatorlpe']; break;
      case 'e01a':
      case 'e01b': lbl = this.labels['asslpepl']; break;
      case 'e02': lbl = this.labels['examinatorlpe']; break;
      case 'e02a': lbl = this.labels['asslpepl']; break;
      case 'e02b': lbl = this.labels['examinatorlpe']; break;
      case 'e02c': lbl = this.labels['examinatorlpe']; break;
      case 'e02d': lbl = this.labels['examinatorlpe']; break;
      case 'e03': lbl = this.labels['examinatorlpr']; break;
      case 'e03a': lbl = this.labels['asslprpl']; break;
      case 'e03b': lbl = this.labels['examinatorlpr']; break;
      case 'e04': lbl = this.labels['examinatorlpr']; break;
      case 'e04a': lbl = this.labels['asslprpl']; break;
      case 'e04b': lbl = this.labels['examinatorlpr']; break;
    }
    return lbl;
  }

}
