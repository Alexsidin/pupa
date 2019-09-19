import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'medium' | 'small';
export type InputType = 'password' | 'text' | 'date';
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
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('inputElement', { static: true }) public inputElement: ElementRef<HTMLInputElement>;
  @Input() public showValidateIcon: boolean = false;
  @Input() public type: InputType = 'text';
  @Input() public size: InputSize = 'medium';
  @Input() public valid: boolean = null;
  @Input() public disabled: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public id: string;
  @Input() public name: string;
  @Input() public width: string;
  @Input()
  public get value(): string {
    return this.valueData;
  }
  public set value(newValue: string) {
    this.updateValue(newValue);
  }

  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

  public touched: boolean = false;

  private valueData: string = '';

  constructor(protected readonly renderer: Renderer2) {}

  public get isDateInput(): boolean {
    return this.type.toLowerCase() === 'date';
  }

  public ngAfterViewInit(): void {
    if (this.width) {
      this.renderer.setStyle(this.inputElement.nativeElement, 'width', `${this.width}`);
    }
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
    this.valueData = String(outerValue);
  }

  public updateValue(innerValue: string): void {
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };
}
