import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isNil, Nullable } from '@bimeister/utilities';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AvatarSize } from '../../declarations/types/avatar-size.type';
import { UserKind } from '../../declarations/types/user-kind.type';

@Component({
  selector: 'pupa-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnChanges {
  @Input({ required: true }) public kind: UserKind;
  protected readonly kind$: ReplaySubject<UserKind> = new ReplaySubject<UserKind>(1);

  @Input({ required: true }) public avatarSize: AvatarSize;
  protected readonly avatarSize$: ReplaySubject<AvatarSize> = new ReplaySubject<AvatarSize>(1);

  @Input({ required: true }) public fullName: string;
  protected readonly fullName$: ReplaySubject<string> = new ReplaySubject<string>(1);

  @Input() public fullNameIcon: string | null = null;
  protected readonly fullNameIcon$: ReplaySubject<string> = new ReplaySubject<string>(1);

  @Input() public description: string[] = [];
  protected readonly description$: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  protected readonly userTooltip$: Observable<string> = combineLatest([this.fullName$, this.description$]).pipe(
    map(([fullName, description]: [string, string[]]) => `${fullName}\n${description.join(' | ')}`),
    distinctUntilChanged()
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processKindChanges(changes.kind);
    this.processFullNameChanges(changes.fullName);
    this.processFullNameIconChanges(changes.fullNameIcon);
    this.processDescriptionChanges(changes.description);
    this.processAvatarSizeChanges(changes.avatarSize);
  }

  private processKindChanges(changes: ComponentChange<this, UserKind> | undefined): void {
    const kind: UserKind | undefined = changes?.currentValue;

    if (isNil(kind)) {
      return;
    }

    this.kind$.next(kind);
  }

  private processFullNameChanges(changes: ComponentChange<this, string> | undefined): void {
    const fullName: string | undefined = changes?.currentValue;

    if (isNil(fullName)) {
      return;
    }

    this.fullName$.next(fullName);
  }

  private processFullNameIconChanges(changes: ComponentChange<this, string | null> | undefined): void {
    const fullNameIcon: Nullable<string> = changes?.currentValue;

    if (isNil(fullNameIcon)) {
      return;
    }

    this.fullNameIcon$.next(fullNameIcon);
  }

  private processDescriptionChanges(changes: ComponentChange<this, string[]> | undefined): void {
    const description: string[] | undefined = changes?.currentValue;

    if (isNil(description)) {
      return;
    }

    this.description$.next(description);
  }

  private processAvatarSizeChanges(changes: ComponentChange<this, AvatarSize> | undefined): void {
    const avatarSize: AvatarSize | undefined = changes?.currentValue;

    if (isNil(avatarSize)) {
      return;
    }

    this.avatarSize$.next(avatarSize);
  }
}
