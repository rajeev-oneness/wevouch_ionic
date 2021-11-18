import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketdetailsPageRoutingModule } from './ticketdetails-routing.module';

import { TicketdetailsPage } from './ticketdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketdetailsPageRoutingModule
  ],
  declarations: [TicketdetailsPage]
})
export class TicketdetailsPageModule {}
