import { Directive, HostBinding, HostListener, ElementRef, Pipe, PipeTransform, Input, AfterViewInit, OnChanges } from '@angular/core';


@Pipe({
  name: 'min'
})
export class MinPipe implements PipeTransform {
  transform(value: number[], args: string[]): any {
    return Math.min.apply(null, value);
  }
}
@Pipe({
  name: 'px'
})
export class PixelConverter implements PipeTransform {
  transform(value: string | number, args: string[]): any {
    if (value === undefined) {
      return;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return value + 'px';
    }
  }
}

@Pipe({
  name: 'perc'
})
export class PercentageConverter implements PipeTransform {
  transform(value: string | number, args: string[]): any {
    if (value === undefined) {
      return;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return value + '%';
    }
  }
}


@Directive({
  selector: '[appdropdown]'
})
export class DropdownDirective {

  private isShow: boolean = false;
  private dropdownParentEl = this.elementRef.nativeElement.closest('.dropdown');
  constructor(private elementRef: ElementRef) { }


  @HostListener('click') open() {
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.dropdownParentEl.classList.add('show');
      this.dropdownParentEl.querySelector(".dropdown-menu").classList.add('show');
    } else {
      this.dropdownParentEl.classList.remove('show');
      this.dropdownParentEl.querySelector(".dropdown-menu").classList.remove('show');
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.elementRef.nativeElement.contains(event.target) && this.isShow) {
      this.dropdownParentEl.classList.add('show');
      this.dropdownParentEl.querySelector(".dropdown-menu").classList.add('show');
    } else {
      this.dropdownParentEl.classList.remove('show');
      this.dropdownParentEl.querySelector(".dropdown-menu").classList.remove('show');
      this.isShow = false;
    }
  }

}

@Directive({
  selector: '[navropdown]',
  host: {
    '[style.cursor]': '"pointer"',
  }
})
export class NavDropdownDirective {
  constructor(private _el: ElementRef) { }
  @HostBinding('class.show') isOpen = false;
  @HostBinding('style.cursor') cur: string = 'pointer';
  @HostListener('click') toogleOpen() {
    this.isOpen = !this.isOpen;
    this._el.nativeElement.querySelector('.dropdown-menu').classList.toggle('show')
  }
}

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements AfterViewInit {
  @Input('focus') focus: boolean = true;

  private el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
      this.el.nativeElement.setSelectionRange(0, this.el.nativeElement.value.length);
    }, 500);
  }

}
