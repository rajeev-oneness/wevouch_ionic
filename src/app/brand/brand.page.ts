import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.page.html',
  styleUrls: ['./brand.page.scss'],
})
export class BrandPage implements OnInit {

  constructor(public viewCtrl: ModalController) { }

  ngOnInit() {
  }
  goBack() {
    this.viewCtrl.dismiss();
  }
  cross() {
    this.viewCtrl.dismiss();
  }

}
