import { Component,Input } from '@angular/core';
import { Router } from '@angular/router';
import { TextsService, CrudService, ICrudCmd } from '../../services';
import * as textdata from './pgaction.component.json';

@Component({
  selector: 'pgaction',
  template: `
<div class="row rowpanel">
  <div class="col text-primary" *ngIf="hasBackbutton">
    <a role="button" class="btn" (click)="goBack()"><i class="fa fa-window-close"></i> {{labels.btnback}}</a>
  </div>
  <div class="col">
    <div class="row justify-content-end">
      <ng-content></ng-content>
    </div>
  </div>
</div>
  `
})
export class PgactionComponent {
  public labels = {};
  @Input() hasBackbutton:boolean=true;

  constructor(private _router: Router, public texts: TextsService) { this.labels = texts.toObject(textdata);}

  goBack(){
    this._router.navigate(['../']);
  }
}
