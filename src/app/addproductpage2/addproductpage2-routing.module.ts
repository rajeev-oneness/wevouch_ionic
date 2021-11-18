import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Addproductpage2Page } from './addproductpage2.page';

const routes: Routes = [
  {
    path: '',
    component: Addproductpage2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Addproductpage2PageRoutingModule {}
