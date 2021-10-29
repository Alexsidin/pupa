import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { shareReplayWithRefCount } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert, AlertsService, ClientUiStateHandlerService } from '../../../../src/public-api';

@Component({
  selector: 'demo-colors-demo',
  templateUrl: './colors-demo.component.html',
  styleUrls: ['./colors-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsDemoComponent {
  public readonly colorsList: string[] = [
    'base-n0',
    'base-n600',
    'base-dark-n100',
    'base-dark-n200',
    'base-dark-n250',
    'base-dark-n275',
    'base-dark-n300',
    'base-dark-n400',
    'base-dark-n500',
    'base-white-n100',
    'base-white-n200',
    'base-white-n250',
    'base-white-n250',
    'base-white-n275',
    'base-white-n300',
    'base-white-n400',
    'base-white-n500',
    'primary-n100',
    'primary-n200',
    'primary-n300',
    'primary-n400',
    'primary-n500',
    'primary-n550',
    'green-n100',
    'green-n200',
    'green-n300',
    'green-n400',
    'green-n500',
    'green-n550',
    'red-n100',
    'red-n200',
    'red-n300',
    'red-n400',
    'red-n500',
    'red-n550',
    'yellow-n100',
    'yellow-n200',
    'yellow-n300',
    'yellow-n400',
    'yellow-n500',
    'yellow-n550'
  ];
  public readonly breakpointIsXsOrSm$: Observable<boolean> = this.clientUiHandlerService.breakpoint$.pipe(
    map((breakpoint: string) => ['xs', 'sm'].includes(breakpoint)),
    shareReplayWithRefCount()
  );

  constructor(
    private readonly cdkClipboard: Clipboard,
    private readonly alertsService: AlertsService,
    private readonly clientUiHandlerService: ClientUiStateHandlerService
  ) {}

  public isColorLight(color: string): boolean {
    const bodyStyles: CSSStyleDeclaration = window.getComputedStyle(document.body);
    const colorPropertyValue: string = bodyStyles.getPropertyValue(`--color_${color}`).trim();
    const r: number = parseInt(colorPropertyValue.substr(1, 2), 16);
    const g: number = parseInt(colorPropertyValue.substr(3, 2), 16);
    const b: number = parseInt(colorPropertyValue.substr(5, 2), 16);
    return r + g + b > 255 * 2.5;
  }

  public getBackground(color: string): Record<string, string> {
    return {
      background: `var(--color_${color})`
    };
  }

  public copyToClipboard(color: string): void {
    this.cdkClipboard.copy(color);
    this.addSuccessAlert('Скопировано в буфер обмена');
  }

  private addSuccessAlert(text: string): void {
    const alert: Alert = {
      id: null,
      text,
      type: 'success',
      needToBeClosed: false
    };
    this.alertsService.create(alert).subscribe();
  }
}
