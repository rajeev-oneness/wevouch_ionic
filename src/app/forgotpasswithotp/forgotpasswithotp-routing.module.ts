import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotpasswithotpPage } from './forgotpasswithotp.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotpasswithotpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotpasswithotpPageRoutingModule {}
