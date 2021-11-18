import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditproductPageRoutingModule } from './editproduct-routing.module';
import { EditproductPage } from './editproduct.page';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditproductPageRoutingModule,NgSelectModule
  ],
  declarations: [EditproductPage]
})
export class EditproductPageModule {}
