import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SelectOptionBase } from '../../../../../internal/declarations/classes/abstract/select-option-base.abstract';
import { SelectStateService } from '../../services/select-state.service';

@Component({
  selector: 'pupa-select-option-checkbox',
  templateUrl: './select-option-checkbox.component.html',
  styleUrls: ['./select-option-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionCheckboxComponent<T> extends SelectOptionBase<T> {
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;

  @Input() public heightPx: number = 32;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
