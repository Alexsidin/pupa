import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-textarea-example-8',
  templateUrl: './example-8.component.html',
  styleUrls: ['./example-8.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaExample8Component {
  public readonly control: FormControl = new FormControl();
}
