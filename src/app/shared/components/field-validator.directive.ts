import { Directive, ElementRef, forwardRef, Input, AfterViewInit, Self, HostListener, Injectable } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, Validator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of ,  of as observableOf } from 'rxjs';
import { first, debounceTime, map, distinctUntilChanged, switchMap, timeout } from 'rxjs/operators';
import { FieldValidatorService } from '../services/field-validator.service';


@Directive({
  selector: '[fldvalid][formControlName], [fldvalid][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FieldValidatorDirective),
      multi: true,
    },
  ],
})
export class FieldValidatorDirective implements AfterViewInit, Validator {
  @Input() fldvalid: AbstractControl;
  public name: string;

  validate(
    control: AbstractControl,
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
    return this.appAsyncValidator(control);
  }

  constructor(
    private _element: ElementRef,
    private _validator: FieldValidatorService,
  ) {
  }

  ngAfterViewInit() {
    this.name = this._element.nativeElement.name;
  }
  // public get name(): string {
  //   return this._element.nativeElement().name;
  // }

  @HostListener('blur')
  private onBlur() {
    this.validateValue();
  }

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.validateValue();
    }
  }

  protected validateValue() {
    return this._validator.validate(this.name, this._element.nativeElement.value)
      .subscribe(
        body => {
          this.fldvalid.setErrors(body);
        },
        err => {
          this.fldvalid.setErrors(err);
        }
      )
    
  }

  public appAsyncValidator(control: AbstractControl): Observable<any> {
    return of(null);

    // if (!control.pristine) {
    //   let name = this.name;
    //   return this._validator.validate(name, control.value)
    //     .pipe(map(data => {
    //       control.setErrors(data);
    //     }))
    // }
    // return of(null);
  }
}
// [fldvalid]="'address'"


// import { Directive, ElementRef, Input, OnInit, Self, HostListener,Injectable } from '@angular/core';
// import { AbstractControl, NgControl, FormGroup } from '@angular/forms';
// import { BrwService, ICrudCmd } from '../services';

// @Directive({
//   selector: '[fldvalid]',
// })
// export class FieldValidatorDirective implements OnInit {
//   @Input() fldvalid: AbstractControl;

//   constructor(
//     private _service: BrwService,
//     public el: ElementRef,
//   ) {

//   }

//   ngOnInit() {
//   }


//   @HostListener('blur')
//   private onBlur() {
//     this.validateValue();
//   }

//   @HostListener('keydown', ['$event'])
//   private onKeyDown(event: KeyboardEvent) {
//     if (event.key === 'Enter') {
//       this.validateValue();
//     }
//   }

//   public validateValue() {
//     let elem = this.el.nativeElement;
//     this._service.validate({ oid: 'validators/' + elem.name, brwFieldValue: elem.value })
//       .subscribe(
//         body => {
//           let x = 0;
//         },
//         err => {
//           this.fldvalid.setErrors({ [elem.name + 'Exist']: true });
//         }
//       )
//   }

// }




