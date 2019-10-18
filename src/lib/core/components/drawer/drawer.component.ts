import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerExpanded', [
      state('false', style({ width: 0 })),
      state('true', style({ width: `*` })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out'))
    ])
  ]
})
export class DrawerComponent implements OnChanges {
  @Input() public isVisible: boolean = false;

  /**
   * @description content wrapper CSS styles property
   * @example contentWidth = '300px'
   */
  @Input() public contentWidth: string = 'fit-content';

  public isContentRendered: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
    const drawerBecameVisible: boolean =
      !isNullOrUndefined(changes.isVisible) && changes.isVisible.currentValue === true;
    if (drawerBecameVisible) {
      this.isContentRendered = true;
    }
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const isCollapseAnimationDone: boolean = String(event.toState) === 'false';
    if (isCollapseAnimationDone) {
      this.isContentRendered = false;
    }
  }
}
