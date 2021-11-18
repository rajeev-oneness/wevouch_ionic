import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { HelperProvider } from 'src/app/service/helper.service';
// import { SocialAuthService } from "angularx-social-login";
// import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
public errorMessage = '';
  public showSlider : boolean = true;
  public mainLogin: boolean = true;
  public otpStep1: boolean = false;
  public otpStep2: boolean = false;
  public forgrtPassStep1: boolean = false;
  public forgrtPassStep2: boolean = false;
  public otpMobile: any = '';
  public forgetPassEmail: any = '';
  public forgetPassEmailOtp: any = '';
  public newForgetPassword: any = '';

  public otp1: any = '';
  public otp2: any = '';
  public otp3: any = '';
  public otp4: any = '';
  isLoggedIn = false;
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };

  constructor(private _api:ApiService,private _router:Router,
    public loadingController: LoadingController,private fb: Facebook,public helper: HelperProvider,
    ) {
    // window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    // if(this._api.isAuthenticated()){
    //   this._router.navigate(['/menu/tabs']);
    // }
    // this.hideLoader();
  }

fbLogin() {
  this.fb.login(['public_profile', 'user_friends', 'email']).then(res => {
      if (res.status === 'connected') {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
}

// fbLogin_new(): void {
//   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
//     (userData) => {
//       console.log(userData);
//     }
//   );
// }

// signInWithGoogle(): void {
//   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then( (userData) => {
//     let user = {'email': userData.email, 'socialId': userData.id};
//     this._api.socialLogin(user).subscribe( 
//       res => {
//         this._api.storeUserLocally(res.user);
//         console.log(res);
//       }, err => {
//         this.errorMessage = err;
//       }
//     );
//     // this._api.storeUserLocally(userData);
//     // this._router.navigate(['/home']);
//     console.log('Google login', userData);
//     // console.log(user);
//   });
// }

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

logout() {
  this.fb.logout()
    .then( res => this.isLoggedIn = false)
    .catch(e => console.log('Error logout from Facebook', e));
}

  private whichScreenToShow = 'loginScreen';
  
  loginUser(formData :any){
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      console.log(formData.value);
      const mainForm = formData.value;
      this.showLoader();
      this._api.userLoginApi(mainForm).subscribe(
        res => {
          this.hideLoader();
          if(res?.user?.is_email_verified == false && res?.user?.is_email_verified == false){
            this.whichScreenToShow = 'otpScreen';
            this.userOTP.email = res?.user?.email;
            this.userOTP.realEmailOTP = res?.user?.email_otp;
            this.userOTP.realMobileOTP = res?.user?.mobile_otp;
            return true;
          }
          console.log('Login User Details',res);
          this._api.storeUserLocally(res.user);
          this.hideLoader();
        },
        err => {
          this.errorMessage = "something went wrong please check credentials and try after sometimes";
          this.hideLoader();
        }
        
      )
    }else{
      this.errorMessage = 'Please fill out all the details';
    }
    // console.log('Form Data SUbmitted');
  }

  public userOTP = {
    email : '',mobile_otp : '',email_otp : '',realMobileOTP : '',realEmailOTP : ''
  };

  otpVerifyForTheUser(){
    console.log('User OTP Field',this.userOTP);
    if(this.userOTP.realMobileOTP != this.userOTP.mobile_otp){
      this.helper.showErrorCustom("Mobile otp verification failed");
    }else if(this.userOTP.realEmailOTP != this.userOTP.email_otp){
      this.helper.showErrorCustom("Email otp verification failed");
    }else{
      this.showLoader();
      var data = {
        email : this.userOTP.email,
        mobile_otp : parseInt(this.userOTP.mobile_otp),
        email_otp : parseInt(this.userOTP.email_otp),
      }
      this._api.userMobileEmailOtpVerify(data).subscribe(
        res => {
          if(res.error == false){
            this._api.storeUserLocally(res.data);
          }else{
            this.helper.showErrorCustom(res.message);
          }
          this.hideLoader();
        },
        err => {
          console.log('Error',err);
          this.helper.showErrorCustom("Something Went wrong. Please do login");
          this.hideLoader();
        }
      )
    }
  }

  // signOut(): void {
  //   this.authService.signOut();
  // }

  loginWithOtp() {
    this.errorMessage = '';

    if(this.otpStep1 === true || this.otpStep2 === true) {
      this.mainLogin = true;
      this.otpStep1 = false;
      this.otpStep2 = false;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    } else {
      this.mainLogin = false;
      this.otpStep1 = true;
      this.otpStep2 = false;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    }
  }
  
  enterOtp() {
    this.errorMessage= '';
    console.log(this.otpMobile);
    if(this.otpMobile != ''){
      this.mainLogin = false;
      this.otpStep1 = false;
      this.otpStep2 = true;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    } else {
      this.errorMessage = 'Phone number can not be null!'
    }
    
  }

  submitOtp() {
    this.errorMessage = ''
    if(this.otp1 && this.otp2 && this.otp3 && this.otp4) {
      const mainOtp = this.otp1+this.otp2+this.otp3+this.otp4
      const mainForm = {
        "mobile" : this.otpMobile,
        "otp" : mainOtp.toString()
      }
      this._api.loginWithOtp(mainForm).subscribe(
        res => {
          this.showLoader();
          console.log(res);
          this._api.storeUserLocally(res);
          this.hideLoader();
          this._router.navigate(["/user/dashboard"]);
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'OTP is required'
    }
  }

  forgetPassword() {
    this.errorMessage = '';

    this.mainLogin = false;
    this.otpStep1 = false;
    this.otpStep2 = false;
    this.forgrtPassStep1 = true;
    this.forgrtPassStep2 = false;
    this._router.navigate(['/forgotpassword'])
  }
  enterForgetPassEmail() {
    this.errorMessage = '';
    console.log(this.forgetPassEmail);
    
    if (this.forgetPassEmail) {
      const formData = {
        "email": this.forgetPassEmail
      }
      this._api.forgotPasswordReqSend(formData).subscribe(
        res => {
          this.showLoader();
          console.log(res);
          this.helper.showErrorCustom('Check your email for OTP!');
          this.mainLogin = false;
          this.otpStep1 = false;
          this.otpStep2 = false;
          this.forgrtPassStep1 = false;
          this.forgrtPassStep2 = true;
          this.hideLoader();
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'Email can not empty!'
    }
  }
  resetPassword() {
    this.errorMessage = '';
    if (this.forgetPassEmail && this.forgetPassEmailOtp && this.newForgetPassword) {
      const formData = {
        "email":this.forgetPassEmail, 
        "otp":this.forgetPassEmailOtp, 
        "password":this.newForgetPassword
      }
      this._api.setNewPassword(formData).subscribe(
        res => {
          this.showLoader();
          console.log(res);
          // this.Toast.fire({
          //   icon: 'success',
          //   title: 'Password reset successfull!'
          // })
                    this.helper.showErrorCustom('Password reset successfull!');
          this.hideLoader();
          window.location.href = environment.projectPath;
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'OTP and New Password required!'
    }
  }

  hideSlider() {
    localStorage.setItem('sliderStatus',JSON.stringify({"hidden": true}));
    this.showSlider = false;
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
otp(){
          this._router.navigate(["/otp"]);
}

}
