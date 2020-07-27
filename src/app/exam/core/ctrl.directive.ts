import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[exacards]'
})
export class ExamDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
