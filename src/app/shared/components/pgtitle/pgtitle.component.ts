import { Component, ViewEncapsulation, ContentChild, ElementRef, Input, AfterViewInit, OnDestroy, ContentChildren, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrwComponent } from '../browse/brw.component';
import { BrwService } from '../browse/brw.service';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'pgtitle',
  templateUrl: './pgtitle.component.html',
  styleUrls: ['./pgtitle.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PgtitleComponent implements AfterViewInit, OnDestroy {
  private _subscribe: Subscription;
  private _uuid: string = '';

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() brwFieldName: string = '';
  @Input() brwFieldValue: string = '';
  @Input() oid: string
  set(val: string) {
    this._uuid = this._service.getUUID(val);
  };

  @ContentChild('search') searchRef: ElementRef;

  constructor(
    private _service: BrwService
  ) { }

  public ngAfterViewInit() {
    if (this.searchRef) {
      const search = fromEvent(this.searchRef.nativeElement, 'keyup').pipe(map((i: any) => i.currentTarget.value));
      const debouncedInput = search.pipe(debounceTime(500));
      this._uuid = this._service.getUUID(this.oid);
      this._subscribe = debouncedInput.subscribe(val => {
        this.brwFieldValue = val;
        this._service.search(this._uuid,val,this.brwFieldName);
      });
    }
  }

  public ngOnDestroy() {
    if (this._subscribe)
      this._subscribe.unsubscribe();
  }

}
