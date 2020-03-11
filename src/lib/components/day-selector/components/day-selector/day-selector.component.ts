import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { WeekdaysFull } from '../../../../../internal/declarations/enums/week-days-full.enum';
import { WeekdaysShort } from '../../../../../internal/declarations/enums/week-days-short.enum';
import { Weekdays } from '../../../../../internal/declarations/enums/week-days.enum';
import { DaysMap } from '../../../../../internal/declarations/interfaces/days-map.interface';

export const daysArrayToMap: (days: number[]) => DaysMap = (days: number[]): DaysMap => {
  const acc: DaysMap = {};
  return days.reduce((a, value): DaysMap => ({ ...a, [value]: true }), acc);
};

@Component({
  selector: 'pupa-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaySelectorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaySelectorComponent {
  public WeekdaysShort: typeof WeekdaysShort = WeekdaysShort;
  public WeekdaysFull: typeof WeekdaysFull = WeekdaysFull;
  public Weekdays: typeof Weekdays = Weekdays;
  @Input() public disabled: boolean;
  @Output() public change: EventEmitter<number[]> = new EventEmitter<number[]>();
  private _value: number[] = [];
  // tslint:disable-next-line:no-magic-numbers
  public allDays: number[] = [1, 2, 3, 4, 5, 6, 0];
  get value(): number[] {
    return this._value;
  }

  @Input() set value(v: number[]) {
    if (v !== this._value) {
      this._value = v;
      this.valueMap = daysArrayToMap(v);
      this.onChange(v);
      this.change.emit(v);
    }
  }

  public valueMap: { [day: number]: boolean } = {};

  public onChange: (v: number[]) => void = (_): void => null;
  public onTouched: () => void = (): void => null;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public writeValue(value: number[]): void {
    if ((value as any) instanceof Event) {
      return;
    }
    this.cdRef.markForCheck();
    this._value = value;
  }

  public registerOnChange(fn: (v: number[]) => void): void {
    this.onChange = (v: number[]): void => {
      this.change.emit(v);
      fn(v);
    };
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onClick(value: number): void {
    if (this.disabled) {
      return;
    }
    this.value = this.value.includes(value) ? this.value.filter(v => v !== value) : [...this.value, value];
  }
}
