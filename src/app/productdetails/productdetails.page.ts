import { NavController, MenuController, ModalController, IonSlides, AlertController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.page.html',
  styleUrls: ['./productdetails.page.scss'],
})
export class ProductdetailsPage implements OnInit {

  prodetailsslideOpts = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 10,
    speed: 400,
    pager:false
  };
inoviceslideOpts = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 10,
    speed: 400,
    pager:false
  };
  @ViewChild('prodSlider')  prodslides: IonSlides;

  swipeNext(){
    this.prodslides.slideNext();
  }
  swipePrev(){
    this.prodslides.slidePrev();
  }

  public showDetail: boolean = false 
  public productDeatil : any = []
  public warrantyValidTill : any = ''
  public amcValidTill : any = ''
  public amcLeftDays : any = ''
  public dateNow : any = Date.now(); 
  public tickets : any = []
  public newTickets : any = []
  public ongoingTickets : any = []
  public user : any = {}
  public warrantyLeftDays: any = ''
  progressCount: any = ''
  progressBarCount: any = '';
  expiresOn = 0;
  constructor(public viewCtrl: ModalController,private navParams: NavParams, private navCtrl: NavController,
        private menu: MenuController,public helper: HelperProvider,private _api:ApiService,public loadingController: LoadingController, 
        public _router:Router,private callNumber: CallNumber,private photoViewer: PhotoViewer,private socialSharing: SocialSharing,public alertController: AlertController) {
  	let value = this.navParams.get('value');
    this.showHideProductDetail(localStorage.getItem('product_id'));
    
  }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(userData._id);
  }

  shareItem(url)
  {
      console.log('Item Sharing',url);
      this.socialSharing.share('', url,url).then((res)=>{}).catch((err)=>{})
  }

  showimage(url){
    console.log('Image Showing',url)
    this.photoViewer.show(url);
  }

  ticketDetails(_id){
    localStorage.setItem('ticket_id',_id);
    this.dismiss();
    this.navCtrl.navigateForward('/ticketdetails');
  }

  call(number){
    console.log('Calling to the => ',number);
    this.callNumber.callNumber(number, true).then(() => console.log('Launched dialer!')).catch(() => console.log('Error launching dialer'));
  }

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
  async deleteProduct(product_id : any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '',
      subHeader: '',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'Delete',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.deleteProduct_api(product_id);
          }
        }, {
          text: 'Keep it',
          handler: () => {
            console.log('Delete Cancell');
          }
        }
      ]
    });
    await alert.present();
  }


  deleteProduct_api(productId : any) {
        this.showLoader();
        this._api.deleteProduct(productId).subscribe(
          res => {
            // console.log(res);
            const notificationForm = {
              "title": "Product deleted", 
              "userId": this.user._id, 
              "description": "Dear "+this.user.name+", you have successfully deleted the product "+this.productDeatil.name+"."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);
                this.helper.showErrorCustom('Product deleted successfully ')
                this.dismiss();
              }

            );
            this.hideLoader();
          }, err => {}
        )
  }
    getUser(userId : any) {
    this._api.userDetails(userId).subscribe(
      res => {
        this.user = res;
      }
    )
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit(){
    localStorage.setItem('product_id',localStorage.getItem('product_id'));
    this.navCtrl.navigateForward('/editproduct');
    this.dismiss();
  }

  showHideProductDetail(productId) {
    this.amcValidTill = '';
    this.amcLeftDays = '';
    this.showDetail = !this.showDetail;
    this.warrantyValidTill = '';
    if(productId != '') {
      this._api.productDetail(productId).subscribe(
        res => {
          // console.log(res);
          let invoiceImage=res['invoicePhotoUrl']
          let prductImage=res['productImagesUrl']
          // console.log(invoiceImage.length)
          this.productDeatil = res;
          var count=0;
          if (res['brands'] !='') {
            count++
          }
          if (res['category'] !='') {
            count++
          }
          if (res['modelNo'] !='') {
            count++
          }
          if (res['name'] !='') {
            count++
          }
          if (res['purchaseDate'] !='') {
            count++
          }
          if (res['registeredMobileNo'] !='') {
            count++
          }
          if (res['serialNo'] !='') {
            count++
          }
          if (res['subCategory'] !='') {
            count++
          }
          if (res['warrantyPeriod'] !='') {
            count++
          }if (invoiceImage.length !=0) {
            count++
          }
          if (prductImage.length !=0) {
            count++
          }
          console.log('product Details',this.productDeatil);
          console.log('purchaseDate',this.productDeatil.productImagesUrl.length);
          let purchaseDate = new Date(this.productDeatil.purchaseDate);
          purchaseDate.setDate(purchaseDate.getDate()-1);
          this.expiresOn = purchaseDate.setMonth(purchaseDate.getMonth()+this.productDeatil.purchaseDate.warrantyPeriod);
          console.log('this.expiresOn',this.expiresOn);
          
          this.progressCount=Math.floor((count/11)*100);
          this.progressBarCount=(this.progressCount/100);
          console.log("count",this.progressBarCount);
          this.warrantyValidTill = this.productDeatil.createdAt;
          this.warrantyLeftDays = 0;
          if(res.purchaseDate) {
            let purchaseDate = new Date(res.purchaseDate);
            this.warrantyValidTill = purchaseDate.setMonth(purchaseDate.getMonth()+res.warrantyPeriod);
            this.warrantyValidTill = this.warrantyValidTill-1
            console.log('warranty valid tillpurchaseDate ' , res.warrantyPeriod);
            console.log('warranty valid till dateNow' , this.warrantyValidTill);
            if (this.dateNow > this.warrantyValidTill) {
              this.warrantyLeftDays = 0;
            }else{
              this.warrantyLeftDays = dateDiffInDays(this.dateNow, this.warrantyValidTill);
            }


          }
          if(res.amcDetails?.noOfYears) {
            let amcSrtartDate = new Date(res.amcDetails.startDate);
            this.amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(res.amcDetails.noOfYears*12));
            this.amcLeftDays = dateDiffInDays(this.dateNow, this.amcValidTill);
          }
        }, err => {}
      )
      this._api.ticketListByProduct(productId).subscribe(
        res => {
          console.log(res);
          this.tickets = res;
          this.newTickets = res.filter((t: any) => t.status === 'new');
          this.ongoingTickets = res.filter((t: any) => t.status === 'ongoing');
        }, err => {}
      )
    }
  }

  productDetails(_id){
    // console.log('addTicket')
    localStorage.setItem('product_id',_id);
    this.navCtrl.navigateForward('addticket');
    this.dismiss();
  }
}
