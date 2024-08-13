import { NgModule, Type } from '@angular/core';
import { PupaIconModule } from '@bimeister/pupakit.icons';
import { PupaAvatarModule } from '../avatar/avatar.module';
import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { PupaDividerModule } from '../divider/divider.module';
import { PupaTooltipModule } from '../tooltip/tooltip.module';

const COMPONENTS: Type<unknown>[] = [UserComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [PupaAvatarModule, PupaIconModule, CommonModule, PupaDividerModule, PupaTooltipModule],
})
export class PupaUserModule {}
