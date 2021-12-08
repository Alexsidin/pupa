import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../services/select-state.service';
import { SelectOptionBase } from '../../../../../internal/declarations/classes/abstract/select-option-base.abstract';

@Component({
  selector: 'pupa-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent<T> extends SelectOptionBase<T> {
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;

  @Input() public heightPx: number = 32;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
