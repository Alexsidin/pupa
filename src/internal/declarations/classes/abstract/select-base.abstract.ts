import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, ElementRef, EventEmitter, OnChanges, OnDestroy, Output, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { getElementAllNestedChildren, isNil, Nullable } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { SelectStateService } from '../../interfaces/select-state-service.interface';
import { OnChangeCallback } from '../../types/on-change-callback.type';
import { OnTouchedCallback } from '../../types/on-touched-callback.type';
import { SelectOuterValue } from '../../types/select-outer-value.type';

@Directive()
export abstract class SelectBase<T> implements OnChanges, OnDestroy, ControlValueAccessor {
  public abstract isMultiSelectionEnabled: boolean;
  public abstract isUnselectionEnabled: boolean;
  public abstract isPatched: boolean;
  public abstract placeholder: string;
  public abstract placeholderOnHover: boolean;
  public abstract withReset: boolean;

  public abstract invalidTooltipHideOnHover: boolean = false;
  public abstract invalidTooltipDisabled: boolean = false;
  public abstract invalidTooltip: Nullable<string> = null;
  public abstract invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

  @Output() public focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() public blur: EventEmitter<void> = new EventEmitter<void>();

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly selectStateService: SelectStateService<T>,
    private readonly elementRef: ElementRef<HTMLElement>,
    ngControl: NgControl
  ) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;

    this.selectStateService.setControlRef(ngControl);

    this.subscription.add(this.handleIsExpandedChangesToEmitFocusEvents());
  }

  protected processCloseEvent(event: Event): void {
    const eventTarget: EventTarget = event.target;

    if (!(eventTarget instanceof Element)) {
      this.selectStateService.collapse();
      return;
    }

    this.selectStateService.dropdownOverlayRef$
      .pipe(
        take(1),
        map((overlayRef: OverlayRef | null | undefined) => (isNil(overlayRef) ? null : overlayRef.overlayElement))
      )
      .subscribe((overlayElement: Element | null) => {
        const currentComponentElement: Element = this.elementRef.nativeElement;
        const currentComponentElementChildren: Element[] = getElementAllNestedChildren(currentComponentElement);

        const dropdownElementChildren: Element[] = isNil(overlayElement)
          ? []
          : getElementAllNestedChildren(overlayElement);

        const dropdownElements: Element[] = [...currentComponentElementChildren, ...dropdownElementChildren];
        const isInnerEvent: boolean = dropdownElements.includes(eventTarget);

        if (isInnerEvent) {
          return;
        }

        this.selectStateService.collapse();
      });
  }

  public abstract closeOnOuterEvents(event: Event): void;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsMultiSelectionEnabledValueChange(changes?.isMultiSelectionEnabled);
    this.processIsUnselectionEnabledValueChange(changes?.isUnselectionEnabled);
    this.processIsPatchedValueChange(changes?.isPatched);
    this.processPlaceholderValueChange(changes?.placeholder);
    this.processPlaceholderOnHoverValueChange(changes?.placeholderOnHover);
    this.processWithResetChange(changes?.withReset);

    this.processInvalidTooltipHideOnHoverChange(changes?.invalidTooltipHideOnHover);
    this.processInvalidTooltipDisabledChange(changes?.invalidTooltipDisabled);
    this.processInvalidTooltipChange(changes?.invalidTooltip);
    this.processInvalidTooltipContentTemplateChange(changes?.invalidTooltipContentTemplate);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public writeValue(newValue: SelectOuterValue<T>): void {
    this.selectStateService.setValue(newValue);
  }

  public registerOnChange(onChange: OnChangeCallback<SelectOuterValue<T>>): void {
    this.selectStateService.defineOnChangeCallback(onChange);
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.selectStateService.defineOnTouchedCallback(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.selectStateService.setDisabledState(isDisabled);
  }

  private processIsMultiSelectionEnabledValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setMultiSelectionState(Boolean(updatedState));
  }

  private processIsUnselectionEnabledValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setUnselectionState(Boolean(updatedState));
  }

  private processIsPatchedValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setIsPatchedState(Boolean(updatedState));
  }

  private processPlaceholderValueChange(change: ComponentChange<this, string>): void {
    const updatedState: string | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setPlaceholderState(updatedState);
  }

  private processPlaceholderOnHoverValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setPlaceholderOnHoverState(updatedState);
  }

  private processWithResetChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.selectStateService.setWithResetState(updatedValue);
  }

  private processInvalidTooltipHideOnHoverChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipHideOnHoverState(updatedValue);
  }

  private processInvalidTooltipDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipDisabledState(updatedValue);
  }

  private processInvalidTooltipChange(change: ComponentChange<this, Nullable<string>>): void {
    const updatedValue: Nullable<string> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipState(updatedValue);
  }

  private processInvalidTooltipContentTemplateChange(
    change: ComponentChange<this, Nullable<TemplateRef<unknown>>>
  ): void {
    const updatedValue: Nullable<TemplateRef<unknown>> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipContentTemplateState(updatedValue);
  }

  private handleIsExpandedChangesToEmitFocusEvents(): Subscription {
    return this.selectStateService.isExpanded$.subscribe((isExpanded: boolean) =>
      isExpanded ? this.focus.emit() : this.blur.emit()
    );
  }
}
