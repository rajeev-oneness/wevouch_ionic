import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
})
export class SubcategoryPage implements OnInit {

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
