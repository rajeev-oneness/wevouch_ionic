import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketdetailsPage } from './ticketdetails.page';

const routes: Routes = [
  {
    path: '',
    component: TicketdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketdetailsPageRoutingModule {}
