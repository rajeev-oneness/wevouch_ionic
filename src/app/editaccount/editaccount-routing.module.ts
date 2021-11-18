import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditaccountPage } from './editaccount.page';

const routes: Routes = [
  {
    path: '',
    component: EditaccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditaccountPageRoutingModule {}
