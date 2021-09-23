import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypographyPageComponent } from './typography-page.component';

const routes: Routes = [
  {
    path: '',
    component: TypographyPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypographyPageRoutingModule {}
