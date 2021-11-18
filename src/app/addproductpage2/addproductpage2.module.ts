import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Addproductpage2PageRoutingModule } from './addproductpage2-routing.module';

import { Addproductpage2Page } from './addproductpage2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Addproductpage2PageRoutingModule
  ],
  declarations: [Addproductpage2Page]
})
export class Addproductpage2PageModule {}
