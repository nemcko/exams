import { Component, ViewEncapsulation, ContentChild, ElementRef, Input, AfterViewInit, OnDestroy, ContentChildren, ViewChildren } from '@angular/core';
import { Subscription ,  fromEvent } from 'rxjs';
import { BrwComponent } from '../browse/brw.component';
import { BrwService } from '../browse/brw.service';
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
  @Input() iclass: string = '';
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
        this._service.search(this._uuid, val, this.brwFieldName);
      });
    }


    // public refresh(uuid: string) {
    //   const state = this.state.get(uuid);
    //   if (state) {
    //     state.cid = '#refresh';
    //     state.uuid = uuid;
    //     this.doCommand(state);
    //   }
    // }


    //   onst state = this._service.state.get(this._uuid);
    //   if (state) {
    //     this._starter = {};
    //     if (state.oid) this._starter.oid = state.oid;
    //     this._starter.offset = state.offset;
    //     this._starter.limit = state.limit;

    //     if (state.brwFieldName != null) {
    //       this._starter.brwFieldName = state.brwFieldName;
    //       this._starter.brwFieldValue = state.brwFieldValue;
    //     }

    //     if (state.brwSortBy != null) {
    //       this._starter.brwSortBy = state.brwSortBy;
    //       this._starter.brwSortAsc = (state.brwSortAsc ? true : false);
    //     }

    //   }
    // }





    // this._uuid = this._parent.uuid;
    // if (this.searchControl) {
    //   const input = document.getElementById(this.searchControl);
    //   if (input) {
    //     const search = fromEvent(input, 'keyup').pipe(map((i: any) => i.currentTarget.value));
    //     const debouncedInput = search.pipe(debounceTime(500));
    //     this._subscribe = debouncedInput.subscribe(val => {
    //       this.brwFieldValue = val;
    //       this._parent.reload({
    //         'uuid': this._uuid,
    //         'cid': '#search',
    //         'brwFieldName': this.brwFieldName,
    //         'brwFieldValue': this.brwFieldValue
    //       });
    //     });
    //   }
    // }
  }

  public ngOnDestroy() {
    if (this._subscribe)
      this._subscribe.unsubscribe();
  }

}
