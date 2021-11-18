import { NavController, MenuController, Platform,ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';
declare var RazorpayCheckout:any;
@Component({
  selector: 'app-package',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.scss'],
})
export class PackagePage implements OnInit {

  constructor(public viewCtrl: ModalController,
     private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,public helper: HelperProvider,public platform: Platform) { }

  packageslideOpts = {
    slidesPerView: 1.1,
    initialSlide: 1,
    speed: 400,
    spaceBetween: 18
  };
  public packages : any = ''
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public purchaseOptions: any = {};
  public packageName: any = '';
  amm1=0;

  ngOnInit() {
    // this.showLoader();
    this.getPackageList();
  }
  getPackageList() {
            this.showLoader();

    this._api.packageList().subscribe(
      res => {
        res.forEach((element :any) => {
          element.description = element.description.split(".");
        });
        this.packages = res;
        console.log(res);
        this.hideLoader();
      }, err => {}
    )
  }
  
  // Show the loader for infinite time
  showLoader() {

    this.loadingController.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });

  }
goBack() {
    this.navCtrl.back();
}
  // Hide the loader if already created otherwise return error
  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }
    pay(packageId : any) {
    this._api.packageDetail(packageId).subscribe(
      res => {
        // this.user = res;
        // console.log(this.user);
        let userId = this.userInfo._id;
        let subscriptionId = res._id;
        this.packageName = res.name;
        let packageTicket = res.ticketCount;
        let packageExpiry = res.expiryDate;
     console.log('check>>',res)
    var options = {
      description: res.name + " Subscription",
      image: "../../assets/images/logo.png",
      currency: 'INR',
      key: environment.rzp_key_id,
      amount: res.amount*100,
      name: "wevouch",
      prefill: {
        email: this.userInfo.email,
        contact: this.userInfo.mobile,
        name: this.userInfo.name
      },
      theme: {
        color: '#00c0c9'
      },
      modal: {
        ondismiss: function() {
          this.helper.showErrorCustom('dismissed')
        }
      }
    };

    var successCallback =(payment_id) => {
        //this.helper.showErrorCustom('payment_id: ' + payment_id);
        //this.action();
        // this.helper.showErrorCustom(payment_id)
        // this.helper.showErrorCustom('Calling???==>  '+packageId)
        this.initPay(packageId,payment_id)

        // callApi(payment_id);
    };

    var cancelCallback =(error) => {
      this.helper.showErrorCustom(error.description + ' (Error ' + error.code + ')');
    };

    //RazorpayCheckout.open(options, successCallback, cancelCallback);
    this.platform.ready().then(() => {
      RazorpayCheckout.open(options, successCallback, cancelCallback);
    })
      }
    )
    //this.amm = Number(this.wallet_amount)*100;
    
}

 initPay(packageId : any,payment_id) {
    this.showLoader();
    this._api.packageDetail(packageId).subscribe(
      res => {
        console.log(res);
        let prefilledData = {
          'name': this.userInfo.name,
          'email': this.userInfo.email,
          'contact': this.userInfo.mobile
        }
        let userId = this.userInfo._id;
        let subscriptionId = res._id;
        this.packageName = res.name;
        let packageTicket = res.ticketCount;
        let packageExpiry = res.expiryDate;
            this._api.updateUserDetails(userId, {'subscriptionId': subscriptionId}).subscribe(
              res => {
                console.log(res);
                const formData = {
                  "userId" : userId,
                  "subscriptionId" : subscriptionId,
                  "transactionId" : payment_id,
                  "transactionAmount" : res.subscription.amount
                }
                this._api.addTransaction(formData).subscribe();
                const notificationForm = {
                  "title": "Subscription successfully",
                  "userId": userId,
                  "description": "Dear "+this.userInfo.name+", you have successfully subscribed to our "+this.packageName+" Plan of "+packageTicket+" tickets yearly. Your plan expires on "+packageExpiry
                }
                this._api.addNotification(notificationForm).subscribe();
                const notificationForm2 = {
                  "title": "Subscription Upgraded successfully",
                  "userId": userId,
                  "description": "Dear "+this.userInfo.name+", your subscription has been successfully upgraded to "+this.packageName+" plan. We are glad you are enjoying our services."
                }
                this._api.addNotification(notificationForm2).subscribe();
                this.hideLoader();
                this.helper.showErrorCustom('Your Payment was Successful');
                this.navCtrl.navigateRoot('/account')
              }, err => {}
            )
          }
    );
  }
}
