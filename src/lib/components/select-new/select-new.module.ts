import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { SelectNewButtonComponent } from './components/select-new-button/select-new-button.component';
import { SelectNewDropdownComponent } from './components/select-new-dropdown/select-new-dropdown.component';
import { SelectNewItemComponent } from './components/select-new-item/select-new-item.component';
import { SelectNewItemsContainerComponent } from './components/select-new-items-container/select-new-items-container.component';
import { SelectNewSearchComponent } from './components/select-new-search/select-new-search.component';
import { SelectNewTreeComponent } from './components/select-new-tree/select-new-tree.component';
import { SelectNewComponent } from './components/select-new/select-new.component';

const EXPORTS: any[] = [
  SelectNewComponent,
  SelectNewSearchComponent,
  SelectNewItemComponent,
  SelectNewItemsContainerComponent,
  SelectNewTreeComponent,
  SelectNewButtonComponent
];

const DECLARATIONS: any[] = [...EXPORTS, SelectNewDropdownComponent];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, OverlayModule],
  exports: [...EXPORTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectNewModule {}
