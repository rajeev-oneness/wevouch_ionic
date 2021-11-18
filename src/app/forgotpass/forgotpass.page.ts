import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotpassPage implements OnInit {
email='';
mobile='';
  constructor(private _api:ApiService,public helper: HelperProvider,private _router:Router,public loadingController: LoadingController) { }
ngOnInit() {
  }
enterForgetPassEmail() {
  localStorage.setItem('userMail',this.email);
  //         this._router.navigate(["/otp"]);
          
    if (this.email) {
      const formData = {
        "email": this.email
      }
      this._api.forgotPasswordReqSend(formData).subscribe(
        res => {
          this.showLoader();
          console.log(res);
          this.helper.showErrorCustom('Check your email for OTP!');
          this.hideLoader();
          this._router.navigate(["/forgotpasswithotp"]);
        }, err => {
          this.helper.showErrorCustom('Something went wrong!')
          // this._router.navigate(["/forgotpasswithotp"]);
        }
      )
    } else {
      this.helper.showErrorCustom('Email can not empty!')
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
  alertShow(text){
    alert(text);
  }
}
