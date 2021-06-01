import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';
import { distinctUntilSerializedChanged, filterFalsy } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { SelectStateService } from '../../interfaces/select-state-service.interface';

@Directive()
export abstract class SelectButtonBase<T> implements OnInit, AfterViewInit {
  protected abstract readonly overlayOrigin: CdkOverlayOrigin;
  protected abstract readonly button: ElementRef<HTMLButtonElement>;

  public abstract transparent: boolean;

  public readonly isExpanded$: BehaviorSubject<boolean> = this.selectStateService.isExpanded$;
  public readonly isDisabled$: Observable<boolean> = this.selectStateService.isDisabled$;

  public readonly isTouched$: Observable<boolean> = this.selectStateService.isTouched$;
  public readonly isPatched$: Observable<boolean> = this.selectStateService.isPatched$;
  public readonly isValid$: Observable<boolean> = this.selectStateService.isValid$;

  public readonly isInvalid$: Observable<boolean> = combineLatest([
    this.isDisabled$,
    this.isPatched$,
    this.isValid$,
    this.isTouched$
  ]).pipe(
    distinctUntilSerializedChanged(),
    map(
      ([isDisabled, isPatched, isValid, isTouched]: [boolean, boolean, boolean, boolean]) =>
        (isTouched || isPatched) && !isValid && !isDisabled
    )
  );

  public readonly isContentInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected readonly selectStateService: SelectStateService<T>) {}

  public ngOnInit(): void {
    this.defineDropdownTrigger();
  }

  public ngAfterViewInit(): void {
    this.isContentInit$.next(true);
  }

  public processButtonClick(): void {
    this.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => this.selectStateService.toggleExpansion());
  }

  public toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => this.selectStateService.toggleExpansion());
  }

  public processButtonInputClick(): void {
    this.isDisabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMap(() => this.isExpanded$),
        take(1),
        filterFalsy()
      )
      .subscribe(() => this.selectStateService.open());
  }

  private defineDropdownTrigger(): void {
    this.selectStateService.defineDropdownTrigger(this.overlayOrigin, this.button.nativeElement);
  }
}
