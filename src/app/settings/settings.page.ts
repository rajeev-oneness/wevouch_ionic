import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { HelperProvider } from '../service/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public userInfo : any = {};

  public userSettings : any = {
    userId: '',
    isWhatsappNotification : false,
    isEmailNotification : false,
    isSMSNotification : false,
    isInAppNotification : false,
    isEmailNewsLetter : false,
    isConnectFb : false,
    isTwoFactorAuth : false,
    userSettingId : '',
  }

  constructor(
    private menu: MenuController,
  	private navCtrl: NavController,
    private _api:ApiService,
    public helper: HelperProvider
  ) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.userSettings.userId = this.userInfo?._id;
  }

  ngOnInit() {
    this.getUserSetting();
  }

  openMenu() {
      this.menu.enable(true, 'content');
      this.menu.open('content');
  }

  getUserSetting(){
    this._api.getSettings(this.userInfo?._id).subscribe(
      res => {
        console.log('Response',res);
        if(res.length == 0){
          this.addUserSetting();
        }else{
          var response = res[0];
          this.userSettings.isWhatsappNotification = response.isWhatsappNotification;
          this.userSettings.isEmailNotification = response.isEmailNotification;
          this.userSettings.isSMSNotification = response.isSMSNotification;
          this.userSettings.isInAppNotification = response.isInAppNotification;
          this.userSettings.isEmailNewsLetter = response.isEmailNewsLetter;
          this.userSettings.isConnectFb = response.isConnectFb;
          this.userSettings.isTwoFactorAuth = response.isTwoFactorAuth;
          this.userSettings.userSettingId = response._id;
        }
      },
      err => {
        console.log('Error',err);
      }
    )
    console.log('User info',this.userInfo);
  }

  addUserSetting(){
    this._api.addSettings(this.userSettings).subscribe(
      res => {
        this.getUserSetting();
        console.log('response add User Serring',res);
      },err => {
        console.log('Error add User Serring',err);
      }
    )
  }

  updateUserSetting(){
    console.log('this is final setting',this.userSettings);
    // return true;
    this._api.editSettings(this.userSettings.userSettingId,this.userSettings).subscribe(
      res => {
        // this.userSettings.isWhatsappNotification = res.isWhatsappNotification;
        // this.userSettings.isEmailNotification = res.isEmailNotification;
        // this.userSettings.isSMSNotification = res.isSMSNotification;
        // this.userSettings.isInAppNotification = res.isInAppNotification;
        // this.userSettings.isEmailNewsLetter = res.isEmailNewsLetter;
        // this.userSettings.isConnectFb = res.isConnectFb;
        // this.userSettings.isTwoFactorAuth = res.isTwoFactorAuth;
        // this.userSettings.userSettingId = res._id;
        console.log('setting Updates Success',res);
      },
      err => {
        console.log('setting Updates Error',err);
      }
    )
  }
  
  goBack() {
    this.navCtrl.back();
  }
}
