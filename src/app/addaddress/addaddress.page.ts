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
  selector: 'app-addaddress',
  templateUrl: './addaddress.page.html',
  styleUrls: ['./addaddress.page.scss'],
})
export class AddaddressPage implements OnInit {
public user : any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public addressId : any = ''
  public userAddress : any = []
  public errorMessage : any = ''
  button_name : any = ''
  constructor(public viewCtrl: ModalController,
  	 private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,public helper: HelperProvider,) { 
		this.addressId =localStorage.getItem('addressId');
   }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit(): void {
    console.log(this.addressId)
  	this.addressId =localStorage.getItem('addressId');
  	if (this.addressId !='') {
  		this.button_name='Save Address'
  		this.showLoader();
    	this._api.getAddressById(this.addressId).subscribe(
      res => {
        this.userAddress = res;
        this.hideLoader();
      }, err => {}
    )
  	}else{
  		this.button_name='Add Address';
      this.userAddress=[];
      console.log('addAddress');
  	}
  	
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
editAddress(){
  if (this.userAddress.addressLine1=="") {
    this.helper.showErrorCustom("Please enter your address 1")
  }else if (this.userAddress.addressLine2=="") {
    this.helper.showErrorCustom("Please enter your address 1")
  }else if (this.userAddress.city=="") {
    this.helper.showErrorCustom("Please choose your city")
  }else if (this.userAddress.country=="") {
    this.helper.showErrorCustom("Please enter your country")
  }else if (this.userAddress.pin=="") {
    this.helper.showErrorCustom("Please enter your pin")
  }else if (this.userAddress.state=="") {
    this.helper.showErrorCustom("Please enter your state")
  }else{
  this.showLoader();
	let mainForm = {
        "addressLine1":this.userAddress.addressLine1,
				"addressLine2": this.userAddress.addressLine2,
				"city": this.userAddress.city,
				"country": this.userAddress.country,
				"latitude": "",
				"location": this.userAddress.location,
				"longitude": "",
				"pin": this.userAddress.pin,
				"state": this.userAddress.state,
				"userId": this.user._id
            }
	this._api.editAddress(this.addressId, mainForm).subscribe(
        res => {
          // alert('Address updated successfully!');
          this.helper.showErrorCustom('Address updated successfully!')
          this.dismiss();
          // this._router.navigate(['/address']);
          this.hideLoader();
        }, err => {
          this.hideLoader();
          this.errorMessage = 'Something went wrong!';
          this.helper.showErrorCustom(this.errorMessage);
        }
      )
        }
    }

    addaddress(){
      console.log(this.userAddress.addressLine1);
      if (this.userAddress.addressLine1==undefined) {
    this.helper.showErrorCustom("Please enter your address 1")
  }else if (this.userAddress.addressLine2==undefined) {
    this.helper.showErrorCustom("Please enter your address 2")
  }else if (this.userAddress.city==undefined) {
    this.helper.showErrorCustom("Please choose your city")
  }else if (this.userAddress.country==undefined) {
    this.helper.showErrorCustom("Please enter your country")
  }else if (this.userAddress.pin==undefined) {
    this.helper.showErrorCustom("Please enter your pin")
  }else if (this.userAddress.state==undefined) {
    this.helper.showErrorCustom("Please enter your state")
  }else{
      this.showLoader();
  let mainForm = {
        "addressLine1":this.userAddress.addressLine1,
        "addressLine2": this.userAddress.addressLine2,
        "city": this.userAddress.city,
        "country": this.userAddress.country,
        "latitude": "",
        "location": this.userAddress.location,
        "longitude": "",
        "pin": this.userAddress.pin,
        "state": this.userAddress.state,
        "userId": this.user._id
            }
  this._api.addAddress(mainForm).subscribe(
        res => {
          this.helper.showErrorCustom('Address added successfully!')
          // this._router.navigate(['/address']);
          this.dismiss();
          this.hideLoader();
        }, err => {
          this.hideLoader();
          this.errorMessage = 'Something went wrong!';
          this.helper.showErrorCustom(this.errorMessage);
        }
      )
}
    }
}

