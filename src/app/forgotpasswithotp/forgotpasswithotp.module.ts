import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpasswithotpPageRoutingModule } from './forgotpasswithotp-routing.module';

import { ForgotpasswithotpPage } from './forgotpasswithotp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotpasswithotpPageRoutingModule
  ],
  declarations: [ForgotpasswithotpPage]
})
export class ForgotpasswithotpPageModule {}
