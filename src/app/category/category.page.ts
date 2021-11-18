import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

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
