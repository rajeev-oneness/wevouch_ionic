import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { HelperProvider } from 'src/app/service/helper.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
email='';
mobile='';
  isLoggedIn = false;
  public errorMessage = '';

  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  constructor(private fb: Facebook,private _api:ApiService,private _router:Router,
    public loadingController: LoadingController,public helper: HelperProvider) { }

  ngOnInit() {
  }
  enterForgetPassEmail() {
    if (this.mobile) {
      console.log(this.mobile);
      this._api.loginwithGetOtp({mobile: this.mobile}).subscribe();
      localStorage.setItem('userMobile',this.mobile);
      this._router.navigate(["/otp"]);
    } 
    else{
      this.errorMessage = 'Please enter your mobile number';
      this.helper.showErrorCustom(this.errorMessage)
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
forgetPassword() {
    this.errorMessage = '';
    this._router.navigate(['/login'])
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
  fbLogin() {
  this.fb.login(['public_profile', 'user_friends', 'email'])
    .then(res => {
      if (res.status === 'connected') {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
}

getUserDetail(userid: any) {
  this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
    .then(res => {
      console.log('users>>>',res);
      this.users = res;
      let user = {'email': this.users.email, 'socialId': this.users.id};
      this._api.socialLogin(user).subscribe( 
        res => {
          this.hideLoader();
          this._api.storeUserLocally(res.user);
          console.log(res);
          // this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = err;
          // this._loader.stopLoader('loader');
        }
      );
    })
    .catch(e => {
      console.log(e);
    });
}
}
