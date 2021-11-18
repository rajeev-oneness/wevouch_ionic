import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Addproductpage3Page } from './addproductpage3.page';

const routes: Routes = [
  {
    path: '',
    component: Addproductpage3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Addproductpage3PageRoutingModule {}
