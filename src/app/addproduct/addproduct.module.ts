import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddproductPageRoutingModule } from './addproduct-routing.module';

import { AddproductPage } from './addproduct.page';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddproductPageRoutingModule,NgSelectModule
  ],
  declarations: [AddproductPage]
})
export class AddproductPageModule {}
