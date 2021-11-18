import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { HelperProvider } from '../service/helper.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public userInfo :any = {};
  public changePasswordForm = {email : '',password : '',newPassword : ''};
  constructor(private _api : ApiService,public loadingController: LoadingController,public helper: HelperProvider,private _router:Router) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.changePasswordForm.email = this.userInfo?.email;
  }

  ngOnInit() {
    
  }
  public errorMessage = '';
  changeUserPassword(userChnegForm){
    this.errorMessage = '';
    for( let i in userChnegForm?.controls ){
      userChnegForm?.controls[i].markAsTouched();
    }
    if( userChnegForm?.valid ){
      this.showLoader();
      this._api.changePassword(this.changePasswordForm).subscribe(
        res => {
          this.helper.showErrorCustom('Password Changed Successfully');
          this.changePasswordForm.password = '';
          this.changePasswordForm.newPassword = '';
          this._router.navigate(['menu/tabs/tabs/home']);
          console.log('Response',res);
          this.hideLoader();
        },err => {
          console.log('Error',err);
          this.errorMessage = err?.error?.message;
          this.hideLoader();
        }
      )
    }else{
      this.errorMessage = 'Fill all the data Correctly';
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

}
