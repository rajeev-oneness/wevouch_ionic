import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtendedwarrantyPage } from './extendedwarranty.page';

const routes: Routes = [
  {
    path: '',
    component: ExtendedwarrantyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtendedwarrantyPageRoutingModule {}
