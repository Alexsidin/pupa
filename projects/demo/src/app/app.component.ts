import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';
import { DOCUMENT } from '@angular/common';

const SPECIFIC_REM_MODE_CSS_CLASS: string = 'specific-rem-mode';

@Component({
  selector: 'demo-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.processIsSpecificRemMode());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processIsSpecificRemMode(): Subscription {
    return this.clientUiStateHandlerService.isSpecificRemMode$.subscribe((isSpecificRemMode: boolean) => {
      if (isSpecificRemMode) {
        this.renderer.addClass(this.document.documentElement, SPECIFIC_REM_MODE_CSS_CLASS);
      } else {
        this.renderer.removeClass(this.document.documentElement, SPECIFIC_REM_MODE_CSS_CLASS);
      }
    });
  }
}
