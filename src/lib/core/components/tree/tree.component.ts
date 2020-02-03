import { DataSource, ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, skipUntil, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem, TreeManipulator } from './classes';

@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnChanges, AfterViewInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @ViewChild('viewPort', { static: false }) private readonly viewPort: CdkVirtualScrollViewport;
  @ViewChild('defaultNodeTemplate', { static: true }) private readonly defaultNodeTemplate: TemplateRef<any>;

  @Input() public readonly manipulator: TreeManipulator;
  private readonly manipulator$: BehaviorSubject<TreeManipulator> = new BehaviorSubject<TreeManipulator>(null);
  public readonly notNilManipulator$: Observable<TreeManipulator> = this.manipulator$.pipe(
    filter(manipulator => !isNullOrUndefined(manipulator)),
    shareReplay(1)
  );

  public readonly nodeTemplate$: Observable<TemplateRef<any>> = this.manipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.nodeTemplate),
    map((customNodeTemplate: TemplateRef<any>) =>
      isNullOrUndefined(customNodeTemplate) ? this.defaultNodeTemplate : customNodeTemplate
    )
  );
  public readonly trackBy$: Observable<TrackByFunction<FlatTreeItem>> = this.manipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.trackBy)
  );
  public readonly dataSource$: Observable<DataSource<FlatTreeItem>> = this.notNilManipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.dataSource)
  );
  public readonly treeControl$: Observable<FlatTreeControl<FlatTreeItem>> = this.notNilManipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.treeControl)
  );
  public readonly dataOrigin$: Observable<FlatTreeItem[]> = this.notNilManipulator$.pipe(
    switchMap((manipulator: TreeManipulator) => manipulator.dataOrigin$)
  );
  private readonly selectedNodesIds$: Observable<string[]> = this.notNilManipulator$.pipe(
    switchMap((manipulator: TreeManipulator) => manipulator.selectedNodesIds$)
  );

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter<FlatTreeItem>();

  constructor() {
    this.subscription.add(this.emitExpandedItemOnAction());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      isNullOrUndefined(changes) ||
      isNullOrUndefined(changes.manipulator) ||
      isNullOrUndefined(changes.manipulator.currentValue) ||
      !changes.manipulator.isFirstChange()
    ) {
      return;
    }

    this.handleTreeManipulator(this.manipulator);
  }

  public ngAfterViewInit(): void {
    this.subscribeOnDataExtractionOnScrolling();
    this.refreshViewPort();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public nodeIsSelected(node: FlatTreeItem): Observable<boolean> {
    return this.selectedNodesIds$.pipe(
      filter(() => !isNullOrUndefined(node)),
      filter((selectedNodesIds: string[]) => Array.isArray(selectedNodesIds)),
      map((selectedNodesIds: string[]) => selectedNodesIds.includes(node.id))
    );
  }

  public toggleExpansion(node: FlatTreeItem): void {
    this.notNilManipulator$
      .pipe(
        switchMap((manipulator: TreeManipulator) => manipulator.expandedItemsIds$),
        map((expandedItemsIds: string[]) => expandedItemsIds.includes(node.id)),
        withLatestFrom(this.notNilManipulator$),
        take(1)
      )
      .subscribe(([isExpanded, manipulator]: [boolean, TreeManipulator]) =>
        isExpanded ? manipulator.markAsCollapsed(node) : manipulator.markAsExpanded(node)
      );
  }

  private handleTreeManipulator(manipulator: TreeManipulator): void {
    this.manipulator$.next(manipulator);
  }

  private refreshViewPort(): void {
    this.viewPort.checkViewportSize();
  }

  private subscribeOnDataExtractionOnScrolling(): void {
    const viewPortRerenderingSubscription: Subscription = this.viewPort.renderedRangeStream
      .pipe(skipUntil(this.notNilManipulator$.pipe(take(1))))
      .subscribe((range: ListRange) => {
        this.manipulator.updateVisibleRange(range);
      });
    this.subscription.add(viewPortRerenderingSubscription);
  }

  private emitExpandedItemOnAction(): Subscription {
    return this.manipulator$
      .pipe(
        filter((manipulator: TreeManipulator) => !isNullOrUndefined(manipulator)),
        switchMap((manipulator: TreeManipulator) =>
          manipulator.itemToExpand$.pipe(filter((item: FlatTreeItem) => !isNullOrUndefined(item)))
        )
      )
      .subscribe(item => this.expandedNode.emit(item));
  }

  public readonly hasChild = (_: number, node: FlatTreeItem): boolean => !isNullOrUndefined(node) && node.isExpandable;
  public readonly hasNoChild = (_: number, node: FlatTreeItem): boolean =>
    !isNullOrUndefined(node) && !node.isExpandable;
}
