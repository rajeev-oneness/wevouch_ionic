import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZoomproductPage } from './zoomproduct.page';

const routes: Routes = [
  {
    path: '',
    component: ZoomproductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZoomproductPageRoutingModule {}
