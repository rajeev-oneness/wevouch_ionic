import { AddaddressPage } from '../addaddress/addaddress.page';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {
name='';
email='';
subject='';
description='';

  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,public helper: HelperProvider) { }

  ngOnInit() {
  	this.menu.enable(false);
  }
      goBack() {
        this.navCtrl.back();
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
  sendSupport(){
  	if(this.name==''){
  this.helper.showErrorCustom('Please enter name')
  }else if(this.subject==''){
  this.helper.showErrorCustom('Please enter subject')
  }else if(this.email==''){
  this.helper.showErrorCustom('Please enter email')
  }else if(this.description==''){
  this.helper.showErrorCustom('Please enter description')
  }else{
    this.showLoader();        
      let mainForm = {
              "name": this.name,
              "subject": this.subject,
              "email": this.email,
              "text": this.description,
            }
      console.log(mainForm);
      this._api.userSupport(mainForm).subscribe(
        (res) => {
          this.helper.showErrorCustom(res.message);
          this.hideLoader();
          this.navCtrl.navigateRoot('/menu/tabs/tabs/home')
        },
        (err) => {
         this.helper.showErrorCustom('Something went Wrong')
          this.hideLoader();
        }
      );
     }

  }

}
