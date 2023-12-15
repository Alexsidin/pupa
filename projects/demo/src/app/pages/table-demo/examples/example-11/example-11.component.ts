import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PagedVirtualScrollArguments } from '@bimeister/pupakit.common';
import {
  TableColumnDefinition,
  TableColumnPin,
  TableColumnSorting,
  TableController,
  TableEvents,
  TableFeatureEvents,
  TablePagedDataProducer,
  TableSortingFeature,
  TableTreeDefinition,
  TableTreeFeature,
} from '@bimeister/pupakit.table';
import { sortByProperty } from '@bimeister/utilities';
import { Observable, Subscription, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

interface SomeData {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  expandable?: boolean;
  expanded?: boolean;
  parentId?: string | null;
  level?: number;
}

const DATA: SomeData[] = [
  {
    id: '1',
    firstName: 'Azamat 1',
    lastName: 'Aitaliev 1',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: null,
    level: 0,
  },
  {
    id: '11',
    firstName: 'Azamat 11',
    lastName: 'Aitaliev 11',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: '1',
    level: 1,
  },
  {
    id: '111',
    firstName: 'Azamat 111',
    lastName: 'Aitaliev 111',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: '11',
    level: 2,
  },
  {
    id: '1111',
    firstName: 'Azamat 1111',
    lastName: 'Aitaliev 1111',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '111',
    level: 3,
  },
  {
    id: '1112',
    firstName: 'Azamat 1112',
    lastName: 'Aitaliev 1112',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '111',
    level: 3,
  },
  {
    id: '112',
    firstName: 'Azamat 112',
    lastName: 'Aitaliev 112',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '11',
    level: 2,
  },
  {
    id: '12',
    firstName: 'Azamat 12',
    lastName: 'Aitaliev 12',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: '1',
    level: 1,
  },
  {
    id: '121',
    firstName: 'Azamat 121',
    lastName: 'Aitaliev 121',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '12',
    level: 2,
  },
  {
    id: '2',
    firstName: 'Azamat 2',
    lastName: 'Aitaliev 2',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: null,
    level: 0,
  },
  {
    id: '3',
    firstName: 'Azamat 3',
    lastName: 'Aitaliev 3',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: null,
    level: 0,
  },
  {
    id: '31',
    firstName: 'Azamat 31',
    lastName: 'Aitaliev 31',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '3',
    level: 1,
  },
];
// DATA = Array.from({ length: 1000 })
//   .map((_: undefined) => [...DATA])
//   .flat();

const tableTreeDefinition: TableTreeDefinition = {
  modelIdKey: 'id',
  modelExpandableKey: 'expandable',
  modelExpandedKey: 'expanded',
  modelParentIdKey: 'parentId',
  modelLevelKey: 'level',
  treeNodeMarker: 'app-dot-single',
};

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.Left,
    defaultSizes: { widthPx: 200 },
    featureOptions: {
      ...tableTreeDefinition,
    },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: {
      widthPx: 200,
      minWidthPx: 70,
      maxWidthPx: 300,
    },
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'age',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
  },
];

const COLUMNS_MAP: Map<string, TableColumnDefinition> = new Map<string, TableColumnDefinition>(
  COLUMNS.map((column: TableColumnDefinition) => [column.id, column])
);

@Component({
  selector: 'demo-table-example-11',
  templateUrl: './example-11.component.html',
  styleUrls: ['./example-11.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample11Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly controller: TableController<SomeData> = new TableController<SomeData>({
    // Add predefinded sorting feature. Also you may write your own features
    features: [TableSortingFeature, TableTreeFeature],
  });

  private columnDefinitions: TableColumnDefinition[] = COLUMNS;

  private readonly pagedDataProducer: TablePagedDataProducer<SomeData> = new TablePagedDataProducer(this.controller, {
    rowsBufferSize: 5,
    bodyInitialCountOfSkeletonRows: 5,
  });
  private readonly pagedArguments$: Observable<PagedVirtualScrollArguments> = this.pagedDataProducer.arguments$;
  private readonly loadingRowIds: Set<string> = new Set();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    // this.controller.setData(DATA);

    this.subscription.add(this.processSortingChanges());
    this.subscription.add(this.processDndEnd());
    this.subscription.add(this.processExpandChanges());
    this.subscription.add(this.processRangeDataChanges());

    this.subscription.add(this.pagedArguments$.subscribe(console.warn));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processExpandChanges(): Subscription {
    const data: SomeData[] = [...DATA];
    return this.controller
      .getEvents(TableFeatureEvents.ExpandRowChanged)
      .subscribe(({ expandRowInfo: { expanded, rowDataId, rowId } }: TableFeatureEvents.ExpandRowChanged) => {
        const rowDataIndex: number = data.findIndex((item: SomeData) => item.id === rowDataId);
        const row: SomeData = data[rowDataIndex];

        row.expanded = expanded;

        if (Boolean(expanded)) {
          this.loadingRowIds.add(rowId);
          this.controller.setLoading(...this.loadingRowIds);
          let sliceStart: number;
          let sliceEnd: number;
          for (let index: number = 0; index < DATA.length; index++) {
            const item: SomeData = DATA[index];
            if (item.id === rowDataId) {
              sliceStart = index + 1;
              continue;
            }
            if (sliceStart !== undefined && (item.parentId === row.parentId || item.level < row.level)) {
              sliceEnd = index;
              break;
            }
          }
          const slice: SomeData[] = DATA.slice(sliceStart, sliceEnd ?? DATA.length);
          setTimeout(() => {
            this.loadingRowIds.delete(rowId);
            this.controller.setLoading(...this.loadingRowIds);
            data.splice(rowDataIndex + 1, 0, ...slice);
            this.controller.setData(data);
          }, 3000);
        } else {
          const sliceStart: number = rowDataIndex + 1;
          let sliceEnd: number;
          for (let index: number = sliceStart; index < data.length; index++) {
            const item: SomeData = data[index];
            if (item.parentId === row.parentId || item.level < row.level) {
              sliceEnd = index;
              break;
            }
          }
          data.splice(sliceStart, (sliceEnd ?? DATA.length) - sliceStart);
          this.controller.setData(data);
        }
      });
  }

  private processSortingChanges(): Subscription {
    return this.controller
      .getEvents(TableFeatureEvents.ColumnSortingChanged)
      .subscribe(({ tableSort }: TableFeatureEvents.ColumnSortingChanged) => {
        if (tableSort.sort === TableColumnSorting.Asc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(tableSort.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'ascending'));
          return;
        }

        if (tableSort.sort === TableColumnSorting.Desc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(tableSort.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'descending'));
          return;
        }

        this.controller.setData(DATA);
      });
  }

  private processDndEnd(): Subscription {
    return this.controller.getEvents(TableEvents.ColumnDragEnd).subscribe((event: TableEvents.ColumnDragEnd) => {
      const columnDefinitions: TableColumnDefinition[] = [...this.columnDefinitions];

      columnDefinitions.splice(event.oldIndex, 1);
      columnDefinitions.splice(event.newIndex, 0, this.columnDefinitions[event.oldIndex]);

      this.controller.setColumnDefinitions(columnDefinitions);
      this.columnDefinitions = columnDefinitions;
    });
  }

  private processRangeDataChanges(): Subscription {
    return this.pagedArguments$
      .pipe(
        switchMap((pagedArguments: PagedVirtualScrollArguments) => {
          const skip: number = pagedArguments.currentFrom;
          const take: number = pagedArguments.currentTo - pagedArguments.currentFrom;

          return TableExample11Component.getData(skip, take).pipe(
            map(({ total, list }: { total: number; list: SomeData[] }) => {
              const data: SomeData[] = Array.from({ length: total });
              data.splice(skip, take, ...list);

              return data;
            })
          );
        })
      )
      .subscribe((data: SomeData[]) => this.controller.setData(data));
  }

  private static getData(skip: number, take: number): Observable<{ total: number; list: SomeData[] }> {
    const dataSlice: SomeData[] = DATA.slice(skip, skip + take);
    return of({ total: DATA.length, list: dataSlice }).pipe(delay(800));
  }
}
