import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit ,Input} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AsyncValidatorFn, AsyncValidator, Validator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { UserService } from '../../../user/user.service';
import { TextsService } from '../../services/texts.service';
import * as validators from '../../../validators.json';


@Directive({
  selector: '[showerrors][formControlName], [showerrors][ngModel]'
})
export class ShowErrorsDirective implements AfterViewInit, Validator {
  frm: string = 'f';
  fld: string = 'firstname';
  public labels = {};

  @Input() showerrors: AbstractControl;
  htm:string;

  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
    private _user: UserService,
    public _texts: TextsService,
  ) {
    this.labels = _texts.toObject([validators], _user.lng);
    
    this.htm = `
    <div *ngIf="${this.frm}.${this.fld}.invalid && (${this.frm}.${this.fld}.dirty || ${this.frm}.${this.fld}.touched)" class="invalid-feedback">
      <div *ngIf="${this.frm}.${this.fld}.errors.maxlength">${this.labels['errmaxlen']}</div>
    </div>
    `
    
    let data2 =`
    <div *ngIf="field.invalid && (field.dirty || field.touched)" class="invalid-feedback">
      <div *ngIf="field.errors.maxlength">${this.labels['errmaxlen']}</div>
    </div>
    `

    let div:Element = this._renderer.createElement('div');
    div.innerHTML='<div [innerHTML]="htm"></div>';
    this._renderer.appendChild(this._elRef.nativeElement.parentNode,div);

  }

  validate(
    control: AbstractControl,
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
    return null;
  }
  
  ngAfterViewInit() {


    // let data2 = `
    // <div *ngIf="${this.frm}.${this.fld}.invalid && (${this.frm}.${this.fld}.dirty || ${this.frm}.${this.fld}.touched)" class="invalid-feedback">
    //   <div *ngIf="${this.frm}.${this.fld}.errors.maxlength">${this.labels['errmaxlen']}</div>
    // </div>
    // `

    // let div:Element = this._renderer.createElement('div');
    // // const text = this._renderer.createText(data);
    // div.innerHTML=this.htm;
    // //this._sanitizer.bypassSecurityTrustHtml(data);
    // this._renderer.appendChild(this._elRef.nativeElement.parentNode,div);

    // // const parent = this._elRef.nativeElement.parentNode;
    // // const refChild = this._elRef.nativeElement;

    // // this._renderer.appendChild(parent, div);

  }

}

