import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectorDemoRoutingModule } from './selector-demo-routing.module';
import { SelectorDemoComponent } from './selector-demo.component';
import { SharedModule } from '@kit/internal/shared/shared.module';
import { DemoPlainDaySelectorExampleComponent } from './examples/demo-plain-day-selector-example/demo-plain-day-selector-example.component';
import { DemoItemSizeDaySelectorExampleComponent } from './examples/demo-item-size-day-selector-example/demo-item-size-day-selector-example.component';
import { DemoLocaleDaySelectorExampleComponent } from './examples/demo-locale-day-selector-example/demo-locale-day-selector-example.component';

@NgModule({
  declarations: [
    SelectorDemoComponent,
    DemoPlainDaySelectorExampleComponent,
    DemoItemSizeDaySelectorExampleComponent,
    DemoLocaleDaySelectorExampleComponent,
  ],
  imports: [DemoSharedModule, SelectorDemoRoutingModule, SharedModule],
})
export class SelectorDemoModule {}
