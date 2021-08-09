import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { TableColumn } from '../../../../../internal/declarations/classes/table-column.class';
import { TableRow } from '../../../../../internal/declarations/classes/table-row.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableScrollbarsService } from '../../services/table-scrollbars.service';

@Component({
  selector: 'pupa-table-placeholder-row-container',
  templateUrl: './table-placeholder-row-container.component.html',
  styleUrls: ['./table-placeholder-row-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePlaceholderRowContainerComponent {
  @Input() public columns: TableColumn[];
  @Input() public row: TableRow;
  @Input() public isFullHeightCells: boolean = false;

  public readonly isPlaceholderVisible$: Observable<boolean> = this.tableScrollbarsService.isHorizontalVisible$.pipe(
    map((isHorizontalVisible: boolean) => !isHorizontalVisible)
  );

  constructor(private readonly tableScrollbarsService: TableScrollbarsService) {}
}
