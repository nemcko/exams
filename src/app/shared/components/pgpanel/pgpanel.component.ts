import { Component, ContentChildren, QueryList, ViewEncapsulation, Input, OnInit, AfterViewInit, ContentChild, ElementRef } from '@angular/core';
import { PgviewComponent } from '../pgview/pgview.component'
@Component({
  selector: 'pgpanel',
  templateUrl: './pgpanel.component.html',
  styleUrls: ['./pgpanel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PgpanelComponent implements OnInit, AfterViewInit {
  @Input() lmargins: string = '0px';
  @Input() rmargins: string = '0px';
  // @ContentChildren(PgviewComponent) protected childcomps: QueryList<PgviewComponent>;
  @ContentChildren(PgviewComponent, { descendants: true }) protected childcomps: QueryList<PgviewComponent>
  constructor() { }

  ngOnInit() {
  }
  public ngAfterViewInit() {
    if (this.childcomps) {
      this.childcomps.toArray().forEach((item: PgviewComponent, currentIndex) => {
        window.setTimeout(() => {
          if (this.lmargins && item.lmargin != '0')
            item.lmargin = this.lmargins;
          if (this.rmargins && item.rmargin != '0')
            item.rmargin = this.rmargins;

          // this.elementHeight = (this.nativeElement.offsetWidth * this.randomImage.dim.h) / this.randomImage.dim.w
        }
        )
      })
    }
  }
}
