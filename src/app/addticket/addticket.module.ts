import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddticketPageRoutingModule } from './addticket-routing.module';

import { AddticketPage } from './addticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddticketPageRoutingModule
  ],
  declarations: [AddticketPage]
})
export class AddticketPageModule {}
