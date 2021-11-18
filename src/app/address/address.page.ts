import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { AddaddressPage } from '../addaddress/addaddress.page';

import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import {ActivatedRoute } from "@angular/router";
import { HelperProvider } from 'src/app/service/helper.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
public user : any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public userAddresses : any = []
  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,public helper: HelperProvider,) { }

  ngOnInit() {
  	// this.showLoader();
    this.getAddressData();
  }
  getAddressData() {
  	// this.showLoader();
    this._api.getAddressListByUser(this.user._id).subscribe(
      res => {
        
        console.log('address :',res);        
        this.userAddresses = res;
        this.hideLoader();
      }, err => {}
    )
  }
  ionViewWillEnter(){
    this.getAddressData();
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

  delteAddress(addressId : any) {
        this.showLoader();
        this._api.deleteAddressByID(addressId).subscribe(
          res => {
          	this.helper.showErrorCustom('Address deleted Successfully')
            this.getAddressData()
          }, err => {}
        )
        
      } 
    async editAddress(_id){
      console.log(_id)
      localStorage.setItem('addressId',_id)
      const modal = await this.modalController.create({
        component: AddaddressPage,
        cssClass: 'half-modal',
        componentProps: { value: _id }
      });
      modal.onDidDismiss()
      .then((data) => {
        this.getAddressData();
    });
    return await modal.present();
    	// localStorage.setItem('addressId',_id);
    	// this.navCtrl.navigateForward('/addaddress');
    }
    // addAddress(){
    // 	localStorage.setItem('addressId','');
    // 	this.navCtrl.navigateForward('/addaddress');
    // }
    async addAddress(_id){
      console.log(_id)
      localStorage.setItem('addressId','')
      const modal = await this.modalController.create({
        component: AddaddressPage,
        cssClass: 'half-modal',
        componentProps: { value: '' }
      });
      modal.onDidDismiss()
      .then((data) => {
        this.getAddressData();
    });
    return await modal.present();
      // localStorage.setItem('addressId',_id);
      // this.navCtrl.navigateForward('/addaddress');
    }
    goBack() {
    this.navCtrl.back();
}
  }

