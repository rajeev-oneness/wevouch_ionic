import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	productslideOpts = {
      slidesPerView: 1.8,
	    initialSlide: 0,
	    speed: 400,
	    spaceBetween: 18
  };

  offerslideOpts = {
      slidesPerView: 1.2,
	    initialSlide: 0,
	    speed: 400,
	    spaceBetween: 10
  };
  public user : any = {};
  public products : any = [];
  public showDetail: boolean = false;
  public productDeatil : any = [];
  public warrantyValidTill : any = '';
  public amcValidTill : any = '';
  public amcLeftDays : any = '';
  public dateNow : any = Date.now(); 
  public tickets : any = [];
  public newTickets : any = [];
  public ongoingTickets : any = [];
  public progressCount: any = '';
  public progressBarCount: any = '';
  public productCatShow = false;
  constructor(
      public modalController: ModalController,
      private navCtrl: NavController,
      private menu: MenuController,
      private _api:ApiService,
      public loadingController: LoadingController,
      public _router:Router
  ){}


    ngOnInit(): void {
      // window.scrollTo(0, 0);
      this.showLoader();
      const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.getUser(userData._id);
      this.hideLoader();
    }

    ionViewWillEnter(){
      this.showLoader();
      const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.getUser(userData._id);
      this.hideLoader();
    }
  
    getUser(userId : any) {
      this._api.userDetails(userId).subscribe(
        res => {
          this.user = res;
          this.getProducts();
        }
      )
    }

    raiseIssue(){
      this.navCtrl.navigateForward('/menu/tabs/tabs/products')
    }

    getProducts() {
      this.hideLoader();
      this._api.productList(this.user._id).subscribe(
        res => {
          this.products = res;
          console.log('this.products',this.products);
          
          if(this.products?.length > 0){
            this.productCatShow = false;
          }else{
            this.productCatShow = true;
          }
          var data = [];
          for (let index = 0; index < res.length; index++) {
            let invoiceImage = res[index]['invoicePhotoUrl']
            let prductImage = res[index]['productImagesUrl']
              var count=0;
              if (res[index]['brands'] !='') {
                count++
              }
              if (res[index]['category'] !='') {
                count++
              }
              if (res[index]['modelNo'] !='') {
                count++
              }
              if (res[index]['name'] !='') {
                count++
              }
              if (res[index]['purchaseDate'] !='') {
                count++
              }
              if (res[index]['registeredMobileNo'] !='') {
                count++
              }
              if (res[index]['serialNo'] !='') {
                count++
              }
              if (res[index]['subCategory'] !='') {
                count++
              }
              if (res[index]['warrantyPeriod'] !='') {
                count++
              }
              // if (invoiceImage.length !=0) {
              //   count++
              // }
              // if (prductImage.length !=0) {
              //   count++
              // }
              this.progressCount = Math.floor((count/11)*100);
              this.progressBarCount = (this.progressCount/100);
              // data.push({
              //     "progressCount": this.progressCount,
              //     "progressBarCount": this.progressBarCount,
              //   });
              // this.products[index].extraData = data;
          }
          for (let index = 0; index < res.length; index++) {
            if (res[index]?.purchaseDate) {
              let purchaseDate = new Date(res[index].purchaseDate);console.log(' purchaseDate', purchaseDate);
              purchaseDate.setDate(purchaseDate.getDate()-1);
              res[index].expiresOn = purchaseDate.setMonth(purchaseDate.getMonth()+res[index].warrantyPeriod);
              console.log('res[index].expiresOn', res[index].expiresOn);
              console.log('tday',this.dateNow);
              let warrantyDaysLeft = dateDiffInDays(this.dateNow, res[index].expiresOn);
              var warrantyExpiredDate = new Date(res[index]?.expiresOn).toLocaleDateString("en-us");
              if(warrantyDaysLeft == 30 || warrantyDaysLeft == 3 || warrantyDaysLeft == 0) {
                let title = '';
                let text = '';
                if(warrantyDaysLeft <= 0 ) {
                  title = "Warranty Lapsed";
                  text = "Dear "+this.user.name+", your warranty for "+res[index].name+" has lapsed on "+warrantyExpiredDate+".";
                } else {
                  title = "Warranty Expiry in "+warrantyDaysLeft+" days";
                  text = "Dear "+this.user.name+", your warranty for "+res[index].name+" will expire in "+warrantyDaysLeft+" days on "+warrantyExpiredDate+". Kindly extend your warranty before it expires.";
                }
                this.sendNotification(title, text);
              } else {}
            }
            if(res[index]?.amcDetails?.noOfYears) {
              let amcSrtartDate = new Date(res[index].amcDetails.startDate);
              let amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(res[index].amcDetails.noOfYears*12));
              let amcLeftDays = dateDiffInDays(this.dateNow, amcValidTill);
              if(amcLeftDays == 7 || amcLeftDays == 0) {
                let title = '';
                let text = '';
                if(amcLeftDays == 0 ) {
                  title = "AMC service expired";
                  text = "AMC service of Product "+res[index].name+" has expired.";
                } else {
                  title = "AMC expiry in "+amcLeftDays+" days";
                  text = "Dear "+this.user.name+", your Annual Maintenance Contract for "+res[index].name+" will be expiring in "+amcLeftDays+" days.";
                }
                this.sendNotification(title, text);
              } else {}
            }
            if(res[index]?.extendedWarranty?.noOfYears) {
              let extdWarrantyStart = new Date(res[index].extendedWarranty.startDate);
              let extdWarrantyValidTill = extdWarrantyStart.setMonth(extdWarrantyStart.getMonth()+(res[index].extendedWarranty.noOfYears*12));
              let extdwarrantyLeftDays = dateDiffInDays(this.dateNow, extdWarrantyValidTill);
              if(extdwarrantyLeftDays == 7 || extdwarrantyLeftDays == 0) {
                let title = '';
                let text = '';
                var ExtendedWarrantyValidTill = new Date(extdWarrantyValidTill).toLocaleDateString("en-us");
                if(extdwarrantyLeftDays == 0 ) {
                  title = "Extended warranty expired";
                  text = "Dear "+this.user.name+", your extended warranty for "+res[index].name+" has lapsed on "+ExtendedWarrantyValidTill;
                } else {
                  title = "Extended warranty Expiry in "+extdwarrantyLeftDays+" days";
                  text = "Dear "+this.user.name+", your extended warranty for "+res[index].name+" is coming up for renewal on "+ExtendedWarrantyValidTill+".";
                }
                this.sendNotification(title, text);
              } else {}
            }
          }
          this.hideLoader();
        }, err => {}
      )
    }
    
    sendNotification(title : any, description : any){
        const notificationForm = {
          "title": title, 
          "userId": this.user._id, 
          "description": description
        }
        this._api.addNotification(notificationForm).subscribe(
          res=> {}
        );
    }
    calculateDiff(data){
      // let date = new Date(data.sent);
      // let currentDate = new Date();

      let days = dateDiffInDays(this.dateNow, data);
      return days;
    }
	  openMenu() {
        this.menu.enable(true, 'content');
        this.menu.open('content');
    }

    openNotification() {
        this.menu.enable(true, 'notification');
        this.menu.open('notification');
    }

	  async openproductdetails(product_id) {
        localStorage.setItem('product_id',product_id)
        const modal = await this.modalController.create({
          component: ProductdetailsPage,
          cssClass: 'half-modal',
          componentProps: { value: product_id }
        });
        modal.onDidDismiss().then((data) => {
            this.showLoader();
            const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
            this.getUser(userData._id);
            this.hideLoader();
        });
        return await modal.present();
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
    this.loadingController.dismiss().then((res) => {}).catch((error) => {});
  }
}
