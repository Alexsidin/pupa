import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';

import { TagDemoRoutingModule } from './tag-demo-routing.module';
import { TagDemoComponent } from './tag-demo.component';
import { TagExample1Component } from './examples/example-1/example-1.component';
import { TagExample2Component } from './examples/example-2/example-2.component';
import { TagExample3Component } from './examples/example-3/example-3.component';
import { TagExample4Component } from './examples/example-4/example-4.component';

const EXAMPLE_COMPONENTS: Type<unknown>[] = [
  TagExample1Component,
  TagExample2Component,
  TagExample3Component,
  TagExample4Component,
];

@NgModule({
  declarations: [...EXAMPLE_COMPONENTS, TagDemoComponent],
  imports: [DemoSharedModule, TagDemoRoutingModule],
})
export class TagDemoModule {}
