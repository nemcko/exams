import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { UserService } from '../../../user/user.service';
import { TextsService } from '../../services/texts.service';
import * as validators from '../../../validators.json';

@Component({
  selector: 'frmfld-input',
  template: `
  <input
  #inputElement
  [class]="'form-control'"
  [value]="value"
  [type]="type"
  [id]="id"
  [placeholder]="placeholder"

  (change)="onChange($event)"
  (keyup)="onKeyup($event)"
  (blur)="onBlur($event)" />

  <div *ngIf="inputElement.invalid && (inputElement.dirty || inputElement.touched)" class="invalid-feedback">
    <div *ngIf="inputElement.errors.required">{{labels.errrequired}}</div>
    <div *ngIf="inputElement.errors.validUrl">{{labels.erruserexist}}</div>
    <div *ngIf="inputElement.errors.maxlength">{{labels.errmaxlen}}</div>
  </div>

  `,
  styles: [`:host {  width: 100%; }`],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FldInputComponent),
    multi: true,
  }]
})
export class FldInputComponent implements ControlValueAccessor {
  public labels = {};
  @Input() cls: string = '';
  @Input() type: string = 'text';
  @Input() id: string;
  @Input() placeholder: string = '';
  @Input() label: string = '';

  value: string = '';

  @ViewChild('inputElement') private _inputElement: ElementRef;

  constructor(
    private _renderer: Renderer2,
    private _user: UserService,
    public _texts: TextsService,
  ) {
    this.labels = _texts.toObject([validators], _user.lng);
  }

  get inputElement(): ElementRef {
    return this._inputElement;
  }
  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._renderer.setProperty(this._inputElement.nativeElement, 'disabled', isDisabled);
  }

  onChange(event: any) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }

}
