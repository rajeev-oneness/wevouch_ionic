import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
public userDetail : any = {};
  public copyState : boolean = false;
  constructor(public modalController: ModalController, private navCtrl: NavController,
        public menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router) { }

  ngOnInit() {
  this.showLoader();    
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(user._id);
    
  }
  ionViewWillEnter(){
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(user._id);
  }
  openMenu() {
        this.menu.enable(true, 'content');
        this.menu.open('content');
    }

    openNotification() {
      console.log('Test???')
        this.menu.enable(true, 'notification');
        this.menu.open('notification');
    }
  getUser(userId : any) {
    console.log(userId);
    
    this._api.userDetails(userId).subscribe(
      res => {
        this.userDetail = res;
        console.log(this.userDetail)
        this._api.updateUserLocally(res);
        this.hideLoader();;
      }, err => {}
    )
  }
// Show the loader for infinite time
  showLoader() {

    this.loadingController.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });

  }

  // Hide the loader if already created otherwise return error
  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }
  goBack() {
    this.navCtrl.back();
}
}
