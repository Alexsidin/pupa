import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { UserExample1Component } from './examples/example-1/example-1.component';
import { UserDemoRoutingModule } from './user-demo-routing.module';
import { UserDemoComponent } from './user-demo.component';

@NgModule({
  declarations: [UserDemoComponent, UserExample1Component],
  imports: [DemoSharedModule, UserDemoRoutingModule],
})
export class UserDemoModule {}
