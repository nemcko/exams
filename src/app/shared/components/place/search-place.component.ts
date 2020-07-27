import { Component, ContentChild, ElementRef, Input, AfterViewInit, OnDestroy, ContentChildren, ViewChildren } from '@angular/core';
import { Subscription ,  fromEvent ,  Subject } from 'rxjs';
import { SearchPlaceService } from './search-place.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'searchplace',
  template: `
  <input #searchPlaceElement class="controls" type="text" placeholder="Enter a location" value="">
  <ul *ngIf="results">
  <li *ngFor="let article of articles | slice:0:9">
    <a href="{{ result.latest }}" target="_blank">
      {{ article.nome }}
    </a>
  </li>
  </ul>
`,
  styles: []
})
export class SearchPlaceComponent implements AfterViewInit, OnDestroy {
  searchTerm$ = new Subject<string>();
  results: Object;

  @ContentChild('searchPlaceElement') searchRef: ElementRef;

  constructor(
    private _service: SearchPlaceService
  ) { }

  public ngAfterViewInit() {
    const search = fromEvent(this.searchRef.nativeElement, 'keyup').pipe(map((i: any) => i.currentTarget.value));

    this._service.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results.results;
      });
  }

  public ngOnDestroy() {
    if (this.searchTerm$)
      this.searchTerm$.unsubscribe();
  }


}
