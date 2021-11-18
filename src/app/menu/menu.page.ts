import { NavController, MenuController, ModalController,AlertController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { InAppBrowser ,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages = [
    {
      title: 'My Product',
      url: '/menu/tabs/tabs/products',
      src: '../../assets/images/product.svg'
    },
    {
      title: 'My Account',
      url: '/account',
      src: '../../assets/images/account.svg'
    },
    {
      title: 'My Tickets',
      url: '/menu/tabs/tabs/ticket',
      src: '../../assets/images/ticket.svg'
    },
  ]
  public user : any = {}
  public products : any = []
  public userInfo : any  = '';
  public notificationList : any = [];
  public notificationCount : any = '';
  public newNotificationCount : any = 0;
  options : InAppBrowserOptions = {
      location : 'yes',//Or 'no'
      zoom: 'no',
      fullscreen: "yes",
      hidenavigationbuttons: "yes",
      toolbar:'no',
      hideurlbar: 'yes'
  };

  constructor(public modalController: ModalController, private navCtrl: NavController,
    private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,private alertCtrl: AlertController, private iab: InAppBrowser
  ) {}

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getNotifications();
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if(this.user?._id) {
      this.getProducts();
    }
  }

  getNotifications() {
    if(this.userInfo?._id) {
      setInterval(()=>{
        this._api.notificationList(this.userInfo._id).subscribe(
          res => {
            let array = Array();
            for (let index = (res.length-1); index >= 0; index--) {
              if (res[index].cleared == false) {
                array.push(res[index]);
              }
              // else{
              //   array= Array();
              // }
            }
            this.getNotificationData(array);
          }, err => {}
        )
      },5000);
    }
  }

  getNotificationData(array)
  {
    this.notificationList = array;
    console.log('ntificatin',this.notificationList);
    
    this.newNotificationCount =  array.filter(function(item) {
      return item.status == true;
    })?.length;
  }

  // Marking as a Read or Unread
  markingNotificationAsRead(notificationId = ''){
    this._api.notificationMarkAsRead(this.userInfo._id,notificationId,false).subscribe(
      res => {
        if(res.error == false){
          this.getNotificationData(res.data);
        }
        // console.log('Notification Marked as Read',res);
      }
    )
  }

  //Clear all Notification
  clearAllNotification(){
    console.log('userInfo',this.userInfo);
    this._api.notificationAllClear(this.userInfo._id,true).subscribe(
      res => {
        if(res.error == false && res.message== 'Notification cleared'){
        }
      }
    )
  }

  logout(){
    this.alertCtrl.create({
      header: 'wevouch',
      message: 'Do you want to logout?',
      backdropDismiss: false,
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {}
      }, {
        text: 'Yes',
        handler: () => {
          localStorage.clear();
          this.navCtrl.navigateRoot('/welcome');
        }
      }]
    }).then(alert => {
        alert.present();
    });
  }

  getProducts() {
    this._api.productList(this.user._id).subscribe(
      res => {
        this.products = res.length;
      }
    )
  }

  openlink(weblink){
    let target = "_blank";
    this.iab.create(weblink,target,this.options);
  }
}


