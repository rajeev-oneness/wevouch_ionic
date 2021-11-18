import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZoomproductPageRoutingModule } from './zoomproduct-routing.module';

import { ZoomproductPage } from './zoomproduct.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZoomproductPageRoutingModule
  ],
  declarations: [ZoomproductPage]
})
export class ZoomproductPageModule {}
