import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtendedwarrantyPageRoutingModule } from './extendedwarranty-routing.module';

import { ExtendedwarrantyPage } from './extendedwarranty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtendedwarrantyPageRoutingModule
  ],
  declarations: [ExtendedwarrantyPage]
})
export class ExtendedwarrantyPageModule {}
