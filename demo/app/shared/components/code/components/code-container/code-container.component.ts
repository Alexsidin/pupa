import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { filterNotEmpty, filterNotNil, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap, take, withLatestFrom } from 'rxjs/operators';
import { ComponentChange } from '../../../../../../../src/internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../../../src/internal/declarations/interfaces/component-changes.interface';
import { Tab } from '../../../../../../../src/internal/declarations/interfaces/tab.interface';
import { ExamplesRequestsService } from '../../../../services/requests/examples-request.service';

const PREVIEW_TAB_NAME: string = 'Preview';

@Component({
  selector: 'pupa-code-container',
  templateUrl: './code-container.component.html',
  styleUrls: ['./code-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeContainerComponent implements OnChanges, OnInit {
  @Input() public readonly content: Nullable<Record<string, string>> = null;
  public readonly content$: BehaviorSubject<Nullable<Record<string, string>>> = new BehaviorSubject<
    Nullable<Record<string, string>>
  >(null);

  public readonly contentWithCode$: BehaviorSubject<Nullable<Record<string, string>>> = new BehaviorSubject<
    Nullable<Record<string, string>>
  >(null);

  @Input() public readonly isPreviewExist: boolean = true;
  public readonly isPreviewExist$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly tabs$: Observable<Tab[]> = this.content$.pipe(
    filterNotNil(),
    map((content: Record<string, string>) => Object.keys(content)),
    filterNotEmpty(),
    withLatestFrom(this.isPreviewExist$),
    map(([tabNames, isPreviewExist]: [string[], boolean]) => {
      const names: string[] = isPreviewExist ? [PREVIEW_TAB_NAME, ...tabNames] : tabNames;

      return names.map((tabName: string, tabIndex: number) => ({
        value: tabName,
        name: tabName,
        isActive: tabIndex === 0
      }));
    })
  );

  public readonly activeValues$: ReplaySubject<unknown[]> = new ReplaySubject<unknown[]>(1);

  public readonly activeCode$: Observable<Nullable<string>> = combineLatest([
    this.activeValues$.pipe(
      filterNotEmpty(),
      map((activeValues: unknown[]) => activeValues[0])
    ),
    this.contentWithCode$.pipe(filterNotNil())
  ]).pipe(
    map(([activeValue, content]: [string, Record<string, string>]) => {
      return activeValue === PREVIEW_TAB_NAME ? null : content[activeValue];
    })
  );

  constructor(private readonly examplesRequestsService: ExamplesRequestsService) {}

  public ngOnInit(): void {
    this.calculateActiveTabOnInit();
    this.processCodeRequests();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processContentChange(changes?.content);
    this.processIsPreviewExistChange(changes?.isPreviewExist);
  }

  public handleTabSelection(values: unknown[]): void {
    this.activeValues$.next(values);
  }

  public tabIsActive(value: unknown, activeValues: unknown[]): boolean {
    return activeValues.includes(value);
  }

  private calculateActiveTabOnInit(): void {
    this.tabs$
      .pipe(
        take(1),
        filterNotEmpty(),
        map((tabs: Tab[]) => tabs.filter(({ isActive }: Tab) => isActive).map(({ value }: Tab) => value))
      )
      .subscribe((values: unknown[]) => this.activeValues$.next(values));
  }

  private processContentChange(change: ComponentChange<this, Record<string, string>>): void {
    const updatedValue: Record<string, string> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.content$.next(updatedValue);
  }

  private processIsPreviewExistChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isPreviewExist$.next(updatedValue);
  }

  private processCodeRequests(): void {
    this.content$
      .pipe(
        filterNotNil(),
        switchMap((content: Record<string, string>) => {
          if (isEmpty(content)) {
            return of(null);
          }

          const tabNames: string[] = Object.keys(content);

          return forkJoin(
            tabNames.map((tabName: string) => this.examplesRequestsService.getExampleRawFile(content[tabName]))
          ).pipe(
            take(1),
            map((codes: string[]) => {
              const codeEntries: Map<string, string> = new Map(
                codes.map((code: string, codeIndex: number) => [tabNames[codeIndex], code])
              );
              return Object.fromEntries(codeEntries);
            })
          );
        }),
        filterNotNil(),
        take(1)
      )
      .subscribe((content: Record<string, string>) => this.contentWithCode$.next(content));
  }
}
