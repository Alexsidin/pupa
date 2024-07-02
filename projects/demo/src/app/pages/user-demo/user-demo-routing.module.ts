import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDemoComponent } from './user-demo.component';

const ROUTES: Routes = [
  {
    path: '',
    component: UserDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class UserDemoRoutingModule {}
