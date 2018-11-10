import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pgview',
  templateUrl: './pgview.component.html',
  styleUrls: ['./pgview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PgviewComponent implements OnInit {
  @Input() width: number | string = 100;
  @Input() lmargin: string = '0px';
  @Input() rmargin: string = '0px';

  constructor() { }

  ngOnInit() {
  }

}
