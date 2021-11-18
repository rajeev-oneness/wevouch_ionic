import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfirmPasswordValidator } from "../validation/confirmpassword";
import { PasswordStrengthValidator } from "../validation";
import { NavController, MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  genderList = [
    {id: 'Male', text: 'Male'},
    {id: 'Female', text: 'Female'},
    {id: 'Others', text: 'Others'},
];
// Sign up
regData: any = {
  email: '',
  password: '',
  cpassword: '',
  age:''
};
name='';
first_name : '';
last_name : '';
email='';
mobile='';
password='';
cpassword='';
age='';
gender='';
userReferralCode='';
acceptance = false;
signupForm: FormGroup;
isSubmitted = false;
isSignUpSubmitted = false;
isPasswordVisible = false;
confirmPasswordType: string = "password";
 passwordType: string = 'password';
 passwordIcon: string = 'eye-off';
isConfPasswordVisible=false;
msginputvalue = false;
constructor(private _api:ApiService,
  private _router:Router,
  public loadingController: LoadingController,
  public helper: HelperProvider,
      public formBuilder: FormBuilder,
      private navCtrl: NavController,
) {
  // const nonWhiteSpaceRegExp: RegExp = new RegExp("\\S");
  this.signupForm = this.formBuilder.group({
      // first_name: ['', [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)]],
      email: [
          '',
          Validators.compose([Validators.required, Validators.email])
      ],
      password: [
          '',
          Validators.compose([
            Validators.required, Validators.minLength(6), PasswordStrengthValidator,
          ])
      ],
       cpassword: [
          '',
          Validators.compose([
              Validators.required,
              ConfirmPasswordValidator.equalto("password")
          ])
      ],
      age:[
        '',
          Validators.compose([
            Validators.required, Validators.maxLength(2)
          ])
      ]

  });
  }
  
    ngOnInit(): void {
  
    }
    goBack() {
        this.navCtrl.back();
    }
    private whichScreenToShow = 'regiterScreen';
    changAge(){
      console.log(this.age);
      if (this.age < '18' || this.age>'80' )
        this.msginputvalue = true;
      else
        this.msginputvalue = false;
    }
    signUpUser(){

if (this.first_name == "") {
    this.helper.showErrorCustom("Please enter your first name");
  }else if (this.email=="") {
    this.helper.showErrorCustom("Please enter your email");
  }else if (this.gender=="") {
    this.helper.showErrorCustom("Please choose your gender");
  }else if (this.mobile=="" || this.mobile.length !=10) {
    this.helper.showErrorCustom("Please enter your mobile number");
  }else if (this.age=="") {
    this.helper.showErrorCustom("Please enter your age");
  }else if (this.password=="") {
    this.helper.showErrorCustom("Please enter your password");
  }else if(this.acceptance){
      this.name = this.first_name+' '+(this.last_name ?? '');
        let data = {
          "name": this.name,
          "email": this.regData.email,
          "gender": this.gender,
          "mobile": this.mobile,
          "age":this.age,
          "password":this.regData.password,
          "image":'https://ui-avatars.com/api/?background=random&name='+this.name,
        }
        this._api.userSignupApi(data).subscribe(
          res => {
            // this.errorMessage = res.message;
            if(res?.user?.is_email_verified == false && res?.user?.is_email_verified == false){
              this.whichScreenToShow = 'otpScreen';
              this.userOTP.email = res?.user?.email;
              this.userOTP.realEmailOTP = res?.user?.email_otp;
              this.userOTP.realMobileOTP = res?.user?.mobile_otp;
              return true;
            }
            const notificationForm = {
              "title": "Free Ticket Earn", 
              "userId": res.user._id, 
              "description": "You earn "+res.user.subscription.ticketCount+" tickets."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
            this._api.storeUserLocally(res.user);
            // this._router.navigate(['/login']);
            this.hideLoader();
          },
          err => {
            this.helper.showErrorCustom("Something Went wrong.") ;
            this.hideLoader();
          }
        )
    }else{
      this.helper.showErrorCustom("Please accept the terms & condition");
    }
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
            const notificationForm = {
              "title": "Free Ticket Earn", 
              "userId": res.data._id, 
              "description": "You earn "+res.data.subscription.ticketCount+" tickets."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
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
  public optionsgender(): void { //here item is an object
    console.log(this.gender);
 }
 checkField(field) {
  const formField = this.signupForm.controls[field];
  return (
      formField.invalid && (formField.touched || this.isSignUpSubmitted)
  );
}
}
