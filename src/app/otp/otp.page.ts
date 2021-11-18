import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  public otp: any = '';
errorMessage: any = '';
mobileNumber: any = '';
last4Digits: any = '';

  constructor(private _api:ApiService,public helper: HelperProvider,private _router:Router,public loadingController: LoadingController) {
}
  ngOnInit() {
    this.mobileNumber=localStorage.getItem('userMobile');
    this.last4Digits = this.mobileNumber.substring(this.mobileNumber.length-4, this.mobileNumber.length);
  }
onOtpChange(event){
	console.log(event);
	this.otp=String(event);
}

  submitOtp() {
  	console.log(this.otp)
    if(this.otp.length == 4) {
                this.showLoader();

      // const mainOtp = this.otp1+this.otp2+this.otp3+this.otp4
      const mainForm = {
        "mobile" : localStorage.getItem('userMobile'),
        "otp" : parseInt(this.otp)
      }
      this._api.loginWithOtp(mainForm).subscribe(
        res => {
          console.log(res);
          this.hideLoader();
          this._api.storeUserLocally(res);
          
          // this._router.navigate(["/user/dashboard"]);
        }, err => {
          console.log(err);
          console.log(err.status);
          console.log(err.error.message);
          if (err.status==403 && err.error.message=='User not found') {
            this.errorMessage = 'Please login with registered mobile number';
            this.helper.showErrorCustom(this.errorMessage)
            this.hideLoader();
          } else if (err.status==403 && err.error.message=='Otp is not correct.') {
            this.errorMessage = 'Otp is not correct. Please try again';
            this.helper.showErrorCustom(this.errorMessage)
            this.hideLoader();
          }else{
            this.errorMessage = 'Something went wrong!';
            this.helper.showErrorCustom(this.errorMessage)
            this.hideLoader();
          }
        }
      )
    } else {
      this.errorMessage = 'OTP is required';
      this.helper.showErrorCustom(this.errorMessage)
    }
  }
   // Hide the loader if already created otherwise return error
  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }
  // Show the loader for infinite time
  showLoader() {

    this.loadingController.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });

  }
}
