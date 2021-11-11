import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TableController } from '../../../../../../src/internal/declarations/classes/table-controller.class';
import { Uuid } from '../../../../../../src/internal/declarations/types/uuid.type';
import { TableColumnDefinition } from '../../../../../../src/internal/declarations/interfaces/table-column-definition.interface';
import { TableColumnPin } from '../../../../../../src/internal/declarations/enums/table-column-pin.enum';
import { getUuid } from '@bimeister/utilities';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  date: Date;
}

const DATA: SomeData[] = Array.from({ length: 200 }).map((_value: undefined, index: number) => ({
  id: getUuid(),
  firstName: `Azamat ${index}`,
  lastName: `Aitaliev ${index}`,
  city: 'Moscow',
  date: new Date(),
  age: index + 1
}));

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',

    // left side
    pin: TableColumnPin.Left,
    defaultSizes: { widthPx: 500 }
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 350 }
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 350 }
  },
  {
    id: 'date',
    modelKey: 'date',
    title: 'Date',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 350 }
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',

    // right side
    pin: TableColumnPin.Right,
    defaultSizes: { widthPx: 100 }
  }
];

@Component({
  selector: 'demo-table-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableExample3Component {
  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  public readonly columns: TableColumnDefinition[] = COLUMNS;

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);
  }
}
