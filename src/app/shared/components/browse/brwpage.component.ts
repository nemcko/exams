import { Component, Input, OnDestroy, Inject, forwardRef, AfterViewInit, ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BrwService } from './brw.service';
import { BrwComponent } from './brw.component';
import { TextsService, CrudService, ICrudCmd, ICrudAndData } from '../../services';
import * as textdata from './brwpage.component.json';

@Component({
  selector: 'brwpage',
  template: `
<div #brwpanel class="row pagination">
  <div class="col-5 px-1">
    <a role="button" class="btn text-primary pl-0 pt-0 pb-0"  *ngIf="hasBackbutton" (click)="goBack()"><i class="fa fa-window-close"></i> {{labels.btnback}}</a>
      <span *ngIf="brwpanel.offsetWidth>370">{{labels.paginationRange}}:</span>
      <span [textContent]="count" *ngIf="brwpanel.offsetWidth>370"></span>
  </div>
  <div class="col-7 px-1">
    <div class="d-flex flex-row justify-content-end">
      <div class="d-flex align-items-start">
        <span class="align-self-baseline" *ngIf="brwpanel.offsetWidth>370">{{labels.paginationLimit}}:&nbsp;</span>
        <input #limitInput type="number" class="align-self-baseline px-1 pt-0" min="1" step="1"
          [ngModel]="limit" 
          (keyup.enter)="loadPage('#refresh',pageInput.value,limitInput.value)" (keyup.esc)="limitInput.value = limit"/>
      </div>
      <div class="d-flex flex-row align-items-end">
          <button [disabled]="offset <= 1" (click)="loadPage('#first',pageInput.value,limitInput.value)" class="btn btn-outline-primary align-self-baseline icon-first"></button>
          <button [disabled]="offset <= 1" (click)="loadPage('#prev',pageInput.value,limitInput.value)" class="btn btn-outline-primary align-self-baseline icon-prev"></button>
          <input #pageInput type="number" class="align-self-baseline px-1 pt-0" min="1" step="1" max="{{pages}}"
            [ngModel]="offset" 
            (keyup.enter)="loadPage('#refresh',pageInput.value,limitInput.value)" (keyup.esc)="pageInput.value = offset"/>
          <span class="align-self-baseline">/{{pages}}&nbsp;</span>
          <button [disabled]="offset >= pages" (click)="loadPage('#next',pageInput.value,limitInput.value)" class="btn btn-outline-primary align-self-baseline icon-next"></button>
          <button [disabled]="offset >= pages" (click)="loadPage('#last',pageInput.value,limitInput.value)" class="btn btn-outline-primary align-self-baseline icon-last"></button>
      </div>
    </div>
  </div>
</div>
  `,
  styleUrls: ['./brwpage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrwpageComponent implements AfterViewInit, OnDestroy {
  private _subscription: Subscription;
  private _subscription2: Subscription;
  private _uuid: string = '';

  public labels = {};
  public cid: string = 'refresh';
  public offset: number = 1;
  public count: number = 0;
  public pages: number = 0;

  protected brwFieldName: string = '';
  protected brwFieldValue: string = '';
  protected brwSortBy: string = '';
  protected brwSortAsc: boolean = true;

  @Input() limit: number;
  @Input() hasBackbutton: boolean = false;

  constructor(
    @Inject(forwardRef(() => BrwComponent)) private _parent: BrwComponent,
    private _service: BrwService,
    private _router: Router,
    private _texts: TextsService,
    private _cdr: ChangeDetectorRef,
  ) {
    this.labels = _texts.toObject(textdata);
  }


  public ngAfterViewInit() {
    this._uuid = (this._parent['uuid'] ? this._parent['uuid'] : this._parent['_uuid']);
    this._subscription = this._parent.service.onNotify$.subscribe(cmd => {
      if (cmd.uuid == this._uuid) {
        this.cid = cmd.cid;
        this.offset = cmd.offset;
        this.limit = cmd.limit;
        this.count = cmd.count;
        this.pages = cmd.pages;
        this.brwFieldName = cmd.brwFieldName;
        this.brwFieldValue = cmd.brwFieldValue;
        this.brwSortBy = cmd.brwSortBy;
        this.brwSortAsc = cmd.brwSortAsc;

        this._cdr.detectChanges();
      }
    });
  }


  public ngOnDestroy() {
    if (this._subscription) this._subscription.unsubscribe();
    if (this._subscription2) this._subscription2.unsubscribe();
  }

  public loadPage(cid: string, offset: number, limit: number) {
    this._parent.reload({
      uuid: this._uuid,
      cid: cid,
      offset: offset,
      limit: limit,
      brwFieldName: this.brwFieldName,
      brwFieldValue: this.brwFieldValue,
      brwSortBy: this.brwSortBy,
      brwSortAsc: this.brwSortAsc,
    });
  }

  public goBack() {
    this._router.navigate(['../']);
  }

}