import { ChangeDetectionStrategy, Component, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filterTruthy, isNil, mapToVoid } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Theme } from '../../../../../../../src/internal/declarations/enums/theme.enum';
import { OpenedDrawer } from '../../../../../../../src/internal/declarations/interfaces/opened-drawer.interface';
import { DrawersService } from '../../../../../../../src/internal/shared/services/drawers.service';
import { ThemeWrapperService } from '../../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { SidebarDrawerContentContainerComponent } from '../sidebar-drawer-content-container/sidebar-drawer-content-container.component';

@Component({
  selector: 'demo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnDestroy {
  public readonly logo$: Observable<SafeResourceUrl> = this.themeWrapperService.theme$.pipe(
    map((themeMode: Theme) => {
      return themeMode === Theme.Light ? this.logoLight : this.logoDark;
    })
  );

  private readonly logoDark: SafeResourceUrl;
  private readonly logoLight: SafeResourceUrl;
  public readonly logoIcon: SafeResourceUrl;

  private readonly subscription: Subscription = new Subscription();

  public readonly isMenuOpenedControl: FormControl = new FormControl(false);

  private readonly menuOpened$: Observable<void> = this.isMenuOpenedControl.valueChanges.pipe(
    filterTruthy(),
    mapToVoid()
  );

  private readonly currentOpenedDrawer$: BehaviorSubject<OpenedDrawer> = new BehaviorSubject<OpenedDrawer>(null);

  private readonly drawerOpened$: Observable<OpenedDrawer> = this.currentOpenedDrawer$.pipe(
    filter((currentOpenedDrawer: OpenedDrawer) => !isNil(currentOpenedDrawer?.id))
  );

  private readonly drawerClosed$: Observable<null> = this.drawerOpened$.pipe(
    switchMap((openDrawer: OpenedDrawer) => openDrawer.closed$)
  );

  constructor(
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly sanitizer: DomSanitizer,
    private readonly drawerService: DrawersService,
    private readonly injector: Injector
  ) {
    this.logoLight = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-light.svg');
    this.logoDark = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-dark.svg');
    this.logoIcon = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-icon.svg');

    this.subscription.add(this.closeMenuWhenDrawerClosed());
    this.subscription.add(this.openDrawerWhenMenuOpen());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleToggleNavbar(isOpen: boolean): void {
    this.isMenuOpenedControl.setValue(isOpen);

    if (!isOpen) {
      this.closeDrawer();
    }
  }

  private closeMenuWhenDrawerClosed(): Subscription {
    return this.drawerClosed$.subscribe(() => {
      this.currentOpenedDrawer$.next(null);
      this.isMenuOpenedControl.setValue(false);
    });
  }

  private openDrawerWhenMenuOpen(): Subscription {
    return this.menuOpened$.pipe(switchMap(() => this.getOpenedDrawer())).subscribe((openedDrawer: OpenedDrawer) => {
      this.currentOpenedDrawer$.next(openedDrawer);
    });
  }

  private getOpenedDrawer(): Observable<OpenedDrawer> {
    return this.themeWrapperService.theme$.pipe(
      take(1),
      map((theme: Theme) =>
        this.drawerService.open(SidebarDrawerContentContainerComponent, {
          hasBackdrop: true,
          hasPadding: false,
          closeOnBackdropClick: true,
          isBackdropTransparent: false,
          float: 'left',
          injector: this.injector,
          theme
        })
      )
    );
  }

  private closeDrawer(): void {
    this.drawerOpened$
      .pipe(
        map((openDrawer: OpenedDrawer) => openDrawer.id),
        take(1)
      )
      .subscribe((id: string) => {
        this.drawerService.closeById(id);
        this.currentOpenedDrawer$.next(null);
      });
  }
}
