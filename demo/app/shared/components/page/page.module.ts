import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PageComponent } from './components/page/page.component';
import { TabsModule } from '../../../../../src/lib/components/tabs/tabs.module';
import { PageTabDirective } from './directives/page-tab.directive';
import { RouterModule } from '@angular/router';

const EXPORTS: Type<unknown>[] = [PageComponent, PageTabDirective];
const IMPORTS: Type<unknown>[] = [CommonModule, RouterModule, TabsModule];

@NgModule({
  declarations: EXPORTS,
  imports: IMPORTS,
  exports: EXPORTS,
})
export class PageModule {}
