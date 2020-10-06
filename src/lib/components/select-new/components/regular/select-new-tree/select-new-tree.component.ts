import {
  Attribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { FlatTreeItem } from '../../../../../../internal/declarations/classes/flat-tree-item.class';
import { TreeType } from '../../../../../../internal/declarations/enums/tree-type.enum';
import { TreeItemInterface } from '../../../../../../internal/declarations/interfaces/tree-item.interface';
import { Uuid } from '../../../../../../internal/declarations/types/uuid.type';
import { TreeComponent } from '../../../../tree/components/tree/tree.component';
import { SelectNewStateService } from '../../../services/select-new-state.service';
import { SelectTreeBase } from './../../../../../../internal/declarations/classes/abstract/select-tree-base.abstract';

/** @deprecated remove ViewEncapsulation.None when tree styling is available */
@Component({
  selector: 'pupa-select-new-tree',
  templateUrl: './select-new-tree.component.html',
  styleUrls: ['./select-new-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewTreeComponent extends SelectTreeBase {
  @ViewChild('customPupaTreeComponent') public readonly customPupaTreeComponent: TreeComponent;
  @ViewChild('hierarchicalTreeComponent') public readonly hierarchicalTreeComponent: TreeComponent;
  @ViewChild('flatTreeComponent') public readonly flatTreeComponent: TreeComponent;

  /**
   * @description
   * Already flatten tree data source.
   */
  @Input() public readonly flatDataOrigin: FlatTreeItem[] = [];

  /**
   * @description
   * Flatten tree nodes (folders) to be combined with treeElementsOrigin.
   */
  @Input() public readonly treeNodesOrigin: TreeItemInterface[] = [];

  /**
   * @description
   * Flatten tree elements (folder items) to be combined with treeNodesOrigin.
   */
  @Input() public readonly treeElementsOrigin: TreeItemInterface[] = [];

  @Input() public hideRoot: boolean = false;
  @Input() public isLoading: boolean = false;

  @Output() public readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter();

  constructor(@Attribute('type') type: TreeType, selectNewStateService: SelectNewStateService<Uuid>) {
    super(type, selectNewStateService);
  }
}
