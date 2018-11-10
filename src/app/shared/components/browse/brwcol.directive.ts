import {
  Directive, Input, ContentChild, OnInit
} from '@angular/core';

@Directive({
  selector: 'brwcol'
})
export class BrwcolDirective implements OnInit {
  @Input() name: string;
  @Input() header: string = '';
  @Input() bgcolor: string = '';
  @Input() cls: string = '';
  @Input() width: number | string;
  @ContentChild('dataTableHeader') headerTemplate;
  @ContentChild('dataTableCell') cellTemplate;
  @Input() visible = true;
  
  constructor() { }

  ngOnInit() {
  }

}
