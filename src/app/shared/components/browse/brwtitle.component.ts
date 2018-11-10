import { Component, ContentChild, ContentChildren, AfterViewInit, ViewChild, QueryList, Input, OnDestroy, Inject, forwardRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICrudCmd, ICrudAndData } from '../../services';
import { BrwComponent } from './brw.component';
import { BrwService } from './brw.service';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'brwtitle',
  templateUrl: './brwtitle.component.html',
  styleUrls: ['./brwtitle.component.css']
})
export class BrwtitleComponent implements AfterViewInit, OnDestroy {
  private _subscribe: Subscription;
  private _uuid: string = '';

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() brwFieldName: string = '';
  @Input() brwFieldValue: string = '';
  @Input() searchControl: string = '';


  constructor(
    @Inject(forwardRef(() => BrwComponent)) private _parent: BrwComponent,
    private _service: BrwService
  ) { }

  public ngAfterViewInit() {
    this._uuid = this._parent.uuid;
    if (this.searchControl) {
      const input = document.getElementById(this.searchControl);
      if (input) {
        const search = fromEvent(input, 'keyup').pipe(map((i: any) => i.currentTarget.value));
        const debouncedInput = search.pipe(debounceTime(500));
        this._subscribe = debouncedInput.subscribe(val => {
          this.brwFieldValue = val;
          this._parent.reload({
            'uuid': this._uuid,
            'cid': '#search',
            'brwFieldName': this.brwFieldName,
            'brwFieldValue': this.brwFieldValue
          });
        });
      }
    }
  }

  public ngOnDestroy() {
    if (this._subscribe)
      this._subscribe.unsubscribe();
  }

}
