import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Addproductpage3PageRoutingModule } from './addproductpage3-routing.module';

import { Addproductpage3Page } from './addproductpage3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Addproductpage3PageRoutingModule
  ],
  declarations: [Addproductpage3Page]
})
export class Addproductpage3PageModule {}
