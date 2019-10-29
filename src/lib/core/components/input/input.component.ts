import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

import { isNullOrUndefined } from '../../../helpers/is-null-or-undefined.helper';
import { getRangeEndDate } from './../../../helpers/get-range-end-date.helper';
import { getRangeStartDate } from './../../../helpers/get-range-start-date.helper';
import { isDate } from './../../../helpers/is-date.helper';

export type InputSize = 'medium' | 'small';
export type InputType = 'password' | 'text' | 'date' | 'date-range' | 'number';
export type InputTextAlign = 'left' | 'center' | 'right' | 'inherit';
type ValueType = string | Date | null | number;

@Component({
  selector: 'pupa-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor, Validator, AfterViewInit {
  @ViewChild('inputElement', { static: false }) public inputElement: ElementRef<HTMLInputElement>;
  @Input() public showValidateIcon: boolean = false;
  @Input() public type: InputType = 'text';
  @Input() public size: InputSize = 'medium';
  @Input() public valid: boolean = null;
  @Input()
  public set disabled(newValue: boolean) {
    if (isNullOrUndefined(newValue)) {
      return;
    }
    this.disabledState = newValue;
  }
  public get disabled(): boolean {
    return this.disabledState;
  }
  @Input() public readonly: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public id: string;
  @Input() public name: string;
  @Input() public autocomplete: boolean = false;
  @Input() public textAlign: InputTextAlign = 'left';
  @Input()
  public get value(): ValueType {
    return this.valueData;
  }
  public set value(newValue: ValueType) {
    this.updateValue(newValue);
  }
  public get stringValue(): string {
    if (isNullOrUndefined(this.value)) {
      return '';
    }
    if (typeof this.value === 'string') {
      return this.value;
    }
    if (this.value instanceof Date) {
      return this.value.toISOString();
    }
  }

  @Output() public valueChange: EventEmitter<ValueType> = new EventEmitter<ValueType>();

  public touched: boolean = false;

  public isDatePickerVisible: boolean = false;

  private valueData: ValueType = null;
  private disabledState: boolean = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public get isDateInput(): boolean {
    return this.type.toLowerCase() === 'date' || this.type.toLowerCase() === 'date-range';
  }

  public ngAfterViewInit(): void {
    if (isNullOrUndefined(this.inputElement)) {
      return;
    }
  }

  public showDatePicker(event: MouseEvent): void {
    event.stopPropagation();
    this.isDatePickerVisible = true;
  }

  public registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFunction): void {
    this.onTouched = (): void => {
      fn();
      this.touched = true;
    };
  }

  public writeValue(outerValue: unknown): void {
    this.valueData = this.getSanitizedValue(outerValue, this.type);
    this.changeDetectorRef.detectChanges();
  }

  public updateValue(innerValue: ValueType): void {
    this.isDatePickerVisible = false;
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!isNullOrUndefined(this.valid)) {
      return this.valid ? null : { manualError: true };
    }
    if (
      isNullOrUndefined(control) ||
      isNullOrUndefined(control.errors) ||
      control.pristine ||
      control.untouched ||
      control.disabled
    ) {
      return null;
    }
    return control.errors;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };

  public readonly isDate = (value: unknown): boolean => {
    return isDate(value);
  };

  public readonly getRangeStart = (value: unknown): Date => {
    const parsedValue: Date[] = JSON.parse(JSON.stringify(value));
    if (Array.isArray(parsedValue)) {
      return getRangeStartDate(parsedValue);
    }
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeStartDate(value);
  };

  public readonly getRangeEnd = (value: unknown): Date => {
    const parsedValue: Date[] = JSON.parse(JSON.stringify(value));
    if (Array.isArray(parsedValue)) {
      return getRangeEndDate(parsedValue);
    }
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeEndDate(value);
  };

  private readonly getSanitizedValue: (value: unknown, type: InputType) => ValueType = (
    value: unknown,
    type: InputType
  ): ValueType => {
    if (isNullOrUndefined(value)) {
      return null;
    }

    const isDateInput: boolean = type === 'date' || type === 'date-range';
    if (isDateInput && isDate(value)) {
      return new Date(String(value));
    }

    const isNumberInput: boolean = type === 'number';
    const decimalBase: number = 10;
    const parsedNumber: number = Number.parseInt(String(value), decimalBase);
    if (isNumberInput && !Number.isNaN(parsedNumber)) {
      return parsedNumber;
    }

    return String(value);
  };
}
