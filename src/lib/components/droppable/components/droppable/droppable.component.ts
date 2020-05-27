import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { Component, ElementRef, HostListener, Input, OnDestroy, ViewRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { VOID } from '../../../../../internal/constants/void.const';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-droppable',
  templateUrl: './droppable.component.html'
})
export class DroppableComponent implements OnDestroy {
  @Input() public closeOnContentClick: boolean = true;
  @Input() public horyzontalPosition: 'start' | 'end' = 'start';
  @Input() public verticalPosition: 'top' | 'bottom' = 'bottom';
  @Input() public offsetYPx: number = 10;
  @Input() public viewportMarginPx: number = 15;
  @Input() public hasBackdrop: boolean = false;

  public triggerRef: ElementRef<HTMLElement>;
  public contentRef: CdkPortal;
  private overlayRef: OverlayRef;
  private viewRef: ViewRef;

  public isOpened: boolean = false;

  constructor(private readonly overlay: Overlay) {}

  public beforeOpen: () => Observable<void> = () => of(VOID);
  public beforeClose: () => Observable<void> = () => of(VOID);

  public ngOnDestroy(): void {
    this.close();
  }

  @HostListener('click')
  public open(): void {
    if (isNullOrUndefined(this.triggerRef) || isNullOrUndefined(this.contentRef)) {
      return;
    }

    this.beforeOpen()
      .pipe(
        take(1),
        switchMap(() => {
          this.overlayRef = this.overlay.create(this.getOverlayConfig());
          this.viewRef = this.overlayRef.attach(this.contentRef);

          this.isOpened = true;
          this.viewRef.markForCheck();
          return this.overlayRef.backdropClick();
        })
      )
      .subscribe(() => this.close());
  }

  @HostListener('document:wheel')
  @HostListener('document:mousedown')
  public mouseEventsHandler(): void {
    if (this.hasBackdrop) {
      return;
    }
    this.close();
  }

  public close(): void {
    if (isNullOrUndefined(this.overlayRef) || isNullOrUndefined(this.viewRef)) {
      return;
    }

    this.beforeClose()
      .pipe(take(1))
      .subscribe(() => {
        this.isOpened = false;
        this.viewRef.markForCheck();
        this.overlayRef.dispose();
      });
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy: PositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerRef)
      .withPush(true)
      .withViewportMargin(this.viewportMarginPx)
      .withPositions([
        {
          originX: this.horyzontalPosition,
          originY: this.verticalPosition,
          overlayX: 'start',
          overlayY: 'top',
          offsetY: this.offsetYPx
        }
      ]);

    return new OverlayConfig({
      positionStrategy,
      hasBackdrop: this.hasBackdrop,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
  }
}
