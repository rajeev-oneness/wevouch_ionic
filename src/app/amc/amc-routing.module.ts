import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmcPage } from './amc.page';

const routes: Routes = [
  {
    path: '',
    component: AmcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmcPageRoutingModule {}
