import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmcPageRoutingModule } from './amc-routing.module';

import { AmcPage } from './amc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmcPageRoutingModule
  ],
  declarations: [AmcPage]
})
export class AmcPageModule {}
