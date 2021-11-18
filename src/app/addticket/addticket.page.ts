import { AddaddressPage } from '../addaddress/addaddress.page';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { HelperProvider } from 'src/app/service/helper.service';

@Component({
  selector: 'app-addticket',
  templateUrl: './addticket.page.html',
  styleUrls: ['./addticket.page.scss'],
})
export class AddticketPage implements OnInit {
  public user : any = {};
  public products : any = '';
  public productId : any = '';
  public productDetail : any = {};
  public errorMessage : any = '';
  public addresErrorMessage : any = '';
  public stepOne : boolean = true;
  public stepTwo : boolean = false;
  public stepThree : boolean = false;
  public stepFour : boolean = false;
  public addTicketValue : any = new Object();
  public addedTicketDetail : any = new Object();
  public supportExecutives : any = new Array();
  public userAddresses : any = [];
  public cityData : any = [];
  public brandId : any = '';
  public selectedCity : any = '';
  public serviceCenters : any = [];
    public description : any = [];
  public functionType : any = [];
  public issueType : any = [];
  public pageid : number = 0;
  date: String = new Date().toISOString();
  maxDate : String = '';
  minTime = '10:00';
  maxTime = '17:00';
  hourValues = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19'];
addressId: any = [];
  public pageStatus ='carryin';
  transportationType='Carry In';
  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,public helper: HelperProvider){ }

  ngOnInit() {
    let today = new Date();     
    let nextdate = new Date(today.getFullYear(),today.getMonth(),today.getDate()+10);
    this.maxDate = new Date(nextdate).toISOString();
    this.productId=(localStorage.getItem('product_id'))
      this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.addTicketValue.transportationType = 'On Site';
    this._api.productList(this.user._id).subscribe(
      res => {
        this.products = res.filter( (e:any) => e.status === 'active');
        console.log('Product List', this.products);
      }, err => {}
    )
    this.getAddressList();
    this.hideLoader();
    this.getProductDetail();
    
  }
  carryin(pageStatus){
    this.pageStatus=pageStatus;
  }
    pickup(pageStatus){
    this.pageStatus=pageStatus;
  }
    onsite(pageStatus){
    this.pageStatus=pageStatus;
  }
raiseTicket(pageid){
 if(this.addTicketValue.issueType==undefined){
  this.helper.showErrorCustom('Please enter issue Type')
  }else if(this.addTicketValue.functionType==undefined){
  this.helper.showErrorCustom('Please enter function Type')
  }else if(this.addTicketValue.description==undefined){
  this.helper.showErrorCustom('Please enter description')
  }else{
  let value = {
              "description": this.addTicketValue.description,
              "functionType": this.addTicketValue.functionType,
              "issueType": this.addTicketValue.issueType,
            }
            this.pageid=pageid;
            console.log(value)
          }
}
  getCities() {
    this._api.getCities().subscribe(
      res=> {
        this.cityData = res.cities;
        console.log('city', this.cityData);
        this.selectedCity = res.cities[0].name;
        this.selectCity();
      }
    )
  }

  selectCity() {
    console.log(this.selectedCity);
    
    this._api.getServiceCenter(this.brandId, this.selectedCity).subscribe(
      res => {
        console.log('service center: ', res);
        this.serviceCenters = res.service_centers;
      }, err => {}
    )
  }

  getAddressList() {
    this._api.getAddressListByUser(this.user._id).subscribe(
      res => {
        console.log('addresses :',res);        
        this.userAddresses = res;
      }, err => {}
    )
  }

  getProductDetail() {
    this._api.productDetail(this.productId).subscribe(
      res => {
        this.productDetail = res;
        this._api.getProductBrands().subscribe(
          res => {
            // console.log('brands :', res.brands);
            this.brandId = res.brands.filter((t : any) => t.name === this.productDetail.brands)[0].id;
            console.log(this.brandId);
            this.getCities();
            
          }, err => {}
        )
        this.hideLoader();
        console.log('Product Detail',res);
      }, err => {}
    )
  }
  
  prev() {
    window.scrollTo(0, 0);
    if(this.stepOne === true) {
      this._router.navigate(['/product/list']);
    }
    if(this.stepTwo === true) {
      this.stepOne = true;
      this.stepTwo = false;
      this.stepThree = false;
      this.stepFour = false;
    }
    if(this.stepThree === true) {
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
      this.stepFour = false;
    }
  }
  firstTab(formData:any) {
    window.scrollTo(0, 0);
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      Object.keys(formData.value).forEach((key)=>{
        this.addTicketValue[key] = formData.value[key];
      });
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
      this.stepFour = false;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }
  secondTab(formData:any) {
    window.scrollTo(0, 0);
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      Object.keys(formData.value).forEach((key)=>{
        this.addTicketValue[key] = formData.value[key];
      });
      // Object.keys(formData.value).forEach((key)=>{
      //   this.addTicketValue[key] = formData.value[key];
      // });

      // let multipleAddressArray: any = []
      // this.addressCount.data.forEach(element => {
      //   multipleAddressArray.push(element.addresses)
      // });
      // console.log(multipleAddressArray);
      // this.addTicketValue.multipleAddress = multipleAddressArray;


      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = true;
      this.stepFour = false;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  thirdTab(formData:any) {
    window.scrollTo(0, 0);
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      Object.keys(formData.value).forEach((key)=>{
        this.addTicketValue[key] = formData.value[key];
      });
      this.addTicketValue.productId = this.productId;
      this.addTicketValue.userId = this.user._id;
      this.addTicketValue.category = this.productDetail.category
      this.addTicketValue.brandId = this.productDetail.brands;
      // let mainForm = this.addTicketValue;
      const mainForm = this.addTicketValue;
      console.log(mainForm);
      this._api.ticketAdd(mainForm).subscribe(
        (res) => {
          this._api.userDetails(this.user._id).subscribe(
            res => {
              this._api.updateUserLocally(res);
            }
          )
          this.addedTicketDetail = res.ticket;
          this.assignTicket(res.ticket._id);
          console.log(this.addedTicketDetail);
          const notificationForm = {
            "title": "Ticket raised", 
            "userId": this.user._id, 
            "description": "Dear "+this.user.name+", your ticket "+this.addedTicketDetail.uniqueId+" has been raised for the product "+this.productDetail.name+"."
          }
          this._api.addNotification(notificationForm).subscribe();
          this.hideLoader();
        },
        (err) => {
          this.errorMessage = err;
         
          this.hideLoader();
        }
      );
      // console.log(this.addTicketValue);

      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = false;
      this.stepFour = true;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  onChangeHandler(event) {
    // get data throught event emitter
    this.addressId=event.target.value;
    console.log(event.target.value);
  }
  raiseTicket2(pageid,transportationType){
 if(this.addressId==''){
  this.helper.showErrorCustom('Please choose address')
  }else{
let value = {
              "addressId": this.addressId,
              "functionType": this.functionType,
              "issueType": this.issueType,
            }
            this.pageid=pageid;
            this.transportationType=transportationType;
            console.log(value);
  }
}
  raiseTicket3(pageid){
    if(this.addTicketValue.selectedDate==undefined){
  this.helper.showErrorCustom('Please select date')
  // }else if(this.addTicketValue.selectedTime==undefined){
  // this.helper.showErrorCustom('Please select time')
  }else{
    this.showLoader();        
      let mainForm = {
              "selectedDate": this.addTicketValue.selectedDate,
              "selectedTime": this.addTicketValue.selectedTime,
              "addressId": this.addressId,
              "functionType": this.addTicketValue.functionType,
              "issueType": this.addTicketValue.issueType,
              "description": this.addTicketValue.description,
              "brandId": this.productDetail.brands,
              "category": this.productDetail.category,
              "productId" : this.productId,
              'userId' : this.user._id,
              "transportationType":this.transportationType,
              "city":this.selectedCity,
            }
      console.log(mainForm);
      this._api.ticketAdd(mainForm).subscribe(
        (res) => {
          this._api.userDetails(this.user._id).subscribe(
            res => {
              this._api.updateUserLocally(res);
            }
          )
          this.addedTicketDetail = res.ticket;
          this.assignTicket(res.ticket._id);
          console.log(this.addedTicketDetail);
          const notificationForm = {
            "title": "Ticket raised", 
            "userId": this.user._id, 
            "description": "Dear "+this.user.name+", your ticket "+this.addedTicketDetail.uniqueId+" has been raised for the product "+this.productDetail.name+"."
          }
          this._api.addNotification(notificationForm).subscribe();
          this.helper.showErrorCustom('Service Request Raised');
          this.hideLoader();
          this.pageid=pageid;
        },
        (err) => {
          this.errorMessage = err;
         this.helper.showErrorCustom('Something went Wrong')
          this.hideLoader();
        }
      );
      // console.log(this.addTicketValue);
     }


  }
      goBack() {
        this.navCtrl.back();
    }
  assignTicket(ticketId : any) {
    this._api.getSupportExcutives().subscribe(
      res => {
        this.supportExecutives = [];
        for (let index = 0; index < res.length; index++) {
          this.supportExecutives.push(res[index]._id);
        }
        const random = Math.floor(Math.random() * this.supportExecutives.length);
        console.log(random, this.supportExecutives[random]);
        const executiveForm = {
          "ticketId": ticketId, 
          "executiveId": this.supportExecutives[random]
        };
        this._api.assignTicketToExecutive(executiveForm).subscribe();
      }, err => {}
    )
  }

  addMoreAddress(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      const mainForm = formData.value;
      mainForm.userId = this.user._id;
      mainForm.latitude = '';
      mainForm.longitude = '';
      this._api.addAddress(mainForm).subscribe(
        res => {
          this.showLoader();
          this.getAddressList();
          this.hideLoader();
        }, err => {
          this.errorMessage = 'Something went wrong!';
        }
      )
    } else {
      this.addresErrorMessage = 'Please fill out all the details';
    }
  }

  async openaddaddress() {
          localStorage.setItem('addressId','')

    const modal = await this.modalController.create({
      component: AddaddressPage,
      cssClass: 'half-modal'
    });
    modal.onDidDismiss()
      .then((data) => {
            this.getAddressList();

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

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }


}
interface MULTIPLEADDRESS{
  addresses: string
}