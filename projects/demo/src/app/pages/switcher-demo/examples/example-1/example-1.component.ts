import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-switcher-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitcherExample1Component {
  public formControl: FormControl = new FormControl(true);
  public value: boolean = true;
}
