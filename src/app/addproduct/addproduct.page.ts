import { ExtendedwarrantyPage } from '../extendedwarranty/extendedwarranty.page';
import { AmcPage } from '../amc/amc.page';
import { BrandPage } from '../brand/brand.page';
import { CategoryPage } from '../category/category.page';
import { SubcategoryPage } from '../subcategory/subcategory.page';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ActionSheetController } from '@ionic/angular';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperProvider } from 'src/app/service/helper.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {
  public productTab : boolean = true;
  public warantyTab : boolean = false;
  public finishTab : boolean = false;
  public thankYouTab : boolean = false;
  public extdWarrantyStatus : boolean = true;
  public amcStatus : boolean = true;
  public productImage : boolean = false;
  public categoriesList: any = [{category : 'Others'}];
  public brandList: any = [];
  public subCategoriesList: any = [{sub_category : 'Others'}];
  public modelList: any = [{'model_no' : "Others"}];
  public category: string = '';
  public subCategory: string = '';
  public brandId: string = '';
  public brandName: string = '';
  public modelId: string = '';
  public errorMessage: string = '';
  public addProductValue: any = {};
  public userPhn : number = 0;
  public userEmail : any = '';
  public pageid : number = 0;
  public name : string = '';
  public purchaseDate: any = '';
  public maxDate: any = '';
  public serialNo : string = '';
  public year : string = '';
  public toggleTooltip : any = false;
  public warrantyPeriod : string = '';
  images: any;
  base64Image: any;
  childImg: string = '';
  title = '';
  content = '';
  imageURI = '';
  userDetails:any;
  img = '';
  imageUrl:any;
  public uploadedFile: any ='';
  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  public invoiceImgUrl : any = new Array();
  public productImgUrl : any = new Array();
  public otherModel : any = '';
  myVar1=false;
  sectionHide = 1;

  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController,
        public _router:Router,private datePipe: DatePipe,
        public actionSheetController: ActionSheetController,
        private transfer: FileTransfer,
        private camera: Camera,public helper: HelperProvider,
   ){      
  }

  ngOnInit() {
    this.maxDate = moment().format("YYYY-MM-DD");    
     console.log('this.maxDate',this.maxDate); 
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userPhn = parseInt(user.mobile);
    this.userEmail = parseInt(user.email);
    this.fetchBrands();
    localStorage.setItem('invoiceImgUrl','');
    localStorage.setItem('productImgUrl','');
    localStorage.setItem('addExtendedData','');
    localStorage.setItem('openamcData','');
    localStorage.setItem('mobileNoExtendWarrenty','');
    localStorage.setItem('serviceProviderExtendWarrenty','');
    localStorage.setItem('startDateExtendWarrenty','');
    localStorage.setItem('noOfYearsExtendWarrenty','');
    localStorage.setItem('mobileNoamc','');
    localStorage.setItem('serviceProvideramc','');
    localStorage.setItem('startDateamc','');
    localStorage.setItem('noOfYearsamc','');
    localStorage.setItem('serviceDurationamc','');
    localStorage.setItem('vendorNoamc','');
    this.fetchModel();
  }

  public otherBrand : any = '';public otherCategory : any = '';public otherSubCategory : any = '';

  fetchBrands() {
    this.hideLoader();this.brandId = '';
    this._api.getProductBrands().subscribe(
      res => {
        this.brandList = res.brands.sort((a,b) => a.name > b.name ? 1 : -1);
        this.brandList.push({id : '0',name : "Others"});
        // this.brandId = this.brandList[0].id;
        // this.fetchCategory();
      }, err => {}
    )
  }

  fetchCategory() {
    // console.log('Selected Brand Id',this.brandList);
    this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0].name;
    this.categoriesList = [{category : 'Others'}];this.category = '';
    this._api.getProductCategories(this.brandId).subscribe(
      res => {
        if(res.status == '1' || res.status == 1){
          this.categoriesList = res.categories.sort((a,b) => a.category > b.category ? 1 : -1);
          this.categoriesList.push({category : 'Others'});
          // this.category = this.categoriesList[0].category; // by Default Seleting the First Info
          // this.fetchSubCategory();
          this.hideLoader();
        }
      }, err => {}
    )
  }
 
  fetchSubCategory() {
    this.subCategoriesList = [{sub_category : 'Others'}];this.subCategory = '';
    this._api.getProductSubCategories(this.category).subscribe(
      res => {
        if(res.status == '1' || res.status == 1){
          this.subCategoriesList = res.sub_categories.sort((a,b) => a.sub_category > b.sub_category ? 1 : -1);
          this.subCategoriesList.push({sub_category : 'Others'});
          // this.subCategory = this.subCategoriesList[0].sub_category;
          // this.fetchModel();
        }
      }, err => {}
    )
  }

  fetchModel() {
    this._api.getProductModels(this.subCategory).subscribe(
      res => {
        this.modelList = res.models.sort((a,b) => a.model_no > b.model_no ? 1 : -1);
        this.modelList.push({'model_no' : "Others"});
        // this.modelId = res.models[0].model_no;
        this.hideLoader();
      }
    )
  }

remember() {
   if (this.myVar1==false) {
     this.sectionHide=0;
   }else{
     this.sectionHide=1;
   }
    // console.log(this.myVar1);
  }

  onSelectFile(event: any) {
    this.showLoader();
    this.fileFormatError = '';this.hasFile = false;
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    if(this.selectedFile != undefined && this.selectedFile != null){
      let validFormat = ['png','jpeg','jpg'];
      let fileName = this.selectedFile.name.split('.').pop();
      let data = validFormat.find(ob => ob === fileName);
      if(data != null || data != undefined){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.uploadedFile = event.target?.result;
          this.hasFile = true;
          this.storeFile(this.selectedFile);
        }
        return true;
      }
      this.fileFormatError = 'This File Format is not accepted';
      this.hideLoader();
    }
    return false;
  }

  storeFile(file:any) {
    const mainForm = new FormData();
    mainForm.append('file',file);
    console.log(file);
    this._api.storeFile(mainForm).subscribe(
      res => {
        console.log(res);
        if(this.pageid === 111) {
          this.invoiceImgUrl = res.file_link;
        }
        if(this.pageid === 222) {
          this.productImgUrl = res.file_link;
        }
        this.hideLoader();
      }
    )
  }

  addProduct(formData : any) {
    this.errorMessage = "";
    window.scrollTo(0, 0);
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.category && this.brandId) {
        formData.value.brandId = this.brandName;
        console.log(formData.value);
        this.addProductValue = formData.value;
        this.productTab = false;
        this.warantyTab = true;
        this.finishTab = false;
        this.thankYouTab = false;
      } else {
        this.errorMessage = 'Please fill out all the details';
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
   
  }

  addWarranty(formData : any) {
    this.errorMessage = "";
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.extendedWarranty = formData.value;
      this.extdWarrantyStatus = true
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
 
  addAmc(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.amcDetails = formData.value;
      // this.addProductValue.amcDetails.enddate = formData.value;
      this.amcStatus = true;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
 
  addFinish() {
    if (this.year=='year') {
      this.warrantyPeriod =String(Number(this.warrantyPeriod) * 12);
    }
    this.showLoader();
    if (localStorage.getItem('addExtendedData')) {
      var addExtendedData=JSON.parse(localStorage.getItem('addExtendedData'));
    }
    if (localStorage.getItem('openamcData')) {
      var openamcData=JSON.parse(localStorage.getItem('openamcData'));
    }
    if (this.modelId=='Others') {
      this.modelId=this.otherModel;
    }
    if(this.brandId == 'Others' || this.brandId == '0'){ 
      this.brandId = this.otherBrand;
      this.brandName = this.otherBrand;
    }
    if(this.category == 'Others'){
      this.category = this.otherCategory;
    }
    if(this.subCategory == 'Others'){
      this.subCategory = this.otherSubCategory;
    }

    let value = {
              "category": this.category,
              "brandId": this.brandName,
              "name": this.name,
              "registeredMobileNo": this.userPhn,
              "subCategory":this.subCategory,
              "modelNo": this.modelId,
              "purchaseDate": this.purchaseDate,
              "serialNo": this.serialNo,
              "warrantyPeriod": this.warrantyPeriod,
              "warrantyType":this.year,
              "invoicePhotoUrl":this.invoiceImgUrl,
              "extendedWarranty":addExtendedData,
              "amcDetails":openamcData,
              "productImagesUrl":this.productImgUrl,
              "userId": JSON.parse(localStorage.getItem('userInfo') || '{}')._id,
            }
          this._api.addProduct(value).subscribe(
          (res) => {
            const userDetail = JSON.parse(localStorage.getItem('userInfo') || '{}')
            this.hideLoader();
            this.helper.showErrorCustom('Thank you!! You have successfully added a product.');
            const notificationForm = {
              "title": 'New Product Added',
              "userId": userDetail._id,
              "description": "Dear "+userDetail.name+", your product "+this.name+" has successfully been added."
            }
            this._api.addNotification(notificationForm).subscribe();
            localStorage.setItem('invoiceImgUrl','');
            localStorage.setItem('productImgUrl','');
            localStorage.setItem('addExtendedData','');
            localStorage.setItem('openamcData','');
            localStorage.setItem('mobileNoExtendWarrenty','');
            localStorage.setItem('serviceProviderExtendWarrenty','');
            localStorage.setItem('startDateExtendWarrenty','');
            localStorage.setItem('noOfYearsExtendWarrenty','');
            localStorage.setItem('mobileNoamc','');
            localStorage.setItem('serviceProvideramc','');
            localStorage.setItem('startDateamc','');
            localStorage.setItem('noOfYearsamc','');
            localStorage.setItem('serviceDurationamc','');
            localStorage.setItem('vendorNoamc','');
            this.navCtrl.navigateRoot('/thankyou')
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.hideLoader();
      }
    );
  }
  async openextended() {
    const modal = await this.modalController.create({
      component: ExtendedwarrantyPage,
      cssClass: 'half-modal'
    });
        modal.onDidDismiss()
      .then((data) => {
        var user = data['data'];
               console.log(user);
    localStorage.setItem('addExtendedData',JSON.stringify( user));
        localStorage.setItem('mobileNoExtendWarrenty',user.mobileNo);
    localStorage.setItem('serviceProviderExtendWarrenty',user.serviceProvider);
    localStorage.setItem('startDateExtendWarrenty',user.startDate);
    localStorage.setItem('noOfYearsExtendWarrenty',user.noOfYears);

    });
  return await modal.present();
  }

  async openamc() {
    const modal = await this.modalController.create({
      component: AmcPage,
      cssClass: 'half-modal'
    });
    modal.onDidDismiss()
      .then((data) => {
        var user = data['data'];
               // console.log(user);
            localStorage.setItem('openamcData',JSON.stringify(user));
            localStorage.setItem('mobileNoamc',user.mobileNo);
              localStorage.setItem('serviceProvideramc',user.serviceProvider);
              localStorage.setItem('startDateamc',user.startDate);
              localStorage.setItem('noOfYearsamc',user.noOfYears);
                  localStorage.setItem('serviceDurationamc',user.serviceDuration);
              localStorage.setItem('vendorNoamc',user.vendorNo);
              });
        return await modal.present();
  }

  async openBrand() {
    const modal = await this.modalController.create({
      component: BrandPage,
      cssClass: ''
    });
    modal.onDidDismiss().then((data) => {
      var brandInfo = data.data;
      //console.log('Brand Info',brandInfo);
    });
    return await modal.present();
  }

  async openCategory() {
    const modal = await this.modalController.create({
      component: CategoryPage,
      cssClass: ''
    });
    return await modal.present();
  }
  
  async openSubcategory() {
    const modal = await this.modalController.create({
      component: SubcategoryPage,
      cssClass: ''
    });
    return await modal.present();
  }

  public optionsgender(): void { //here item is an object
    console.log(this.brandId);
 }

 openMenu() {
        this.menu.enable(true, 'content');
        this.menu.open('content');
    }

    openNotification() {
        this.menu.enable(true, 'notification');
        this.menu.open('notification');
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

productPage2(pageid){
  if(this.name==''){
    this.helper.showErrorCustom('Please enter product nickname');
  }else if(this.brandId==''){
    this.helper.showErrorCustom('Please enter product brand');
  }else if(this.category==''){
    this.helper.showErrorCustom('Please enter product category');
  }else if(this.subCategory==''){
    this.helper.showErrorCustom('Please enter product sub category');
  }else if(this.userPhn==null){
    this.helper.showErrorCustom('Please enter your phone number');
  }else{
          let value = {
              "category": this.category,
              "brandId": this.brandName,
              "name": this.name,
              "registeredMobileNo": this.userPhn,
              "subCategory":this.subCategory,
            }
            this.pageid=pageid;
            // console.log(value)
  }
}
 productPage3(pageid){
   if (this.myVar1==false) {
      /*if(this.purchaseDate==''){
        this.helper.showErrorCustom('Please enter your purchase Date')
      }else if(this.warrantyPeriod==''){
        this.helper.showErrorCustom('Please enter product warranty Period')*/
      // }else if(this.modelId==''){
      //     this.helper.showErrorCustom('Please enter product model no')
      // }else{
          let value = {
              "modelNo": this.modelId,
              "purchaseDate": (this.purchaseDate ?? ''),
              "serialNo": this.serialNo,
              "warrantyPeriod": this.warrantyPeriod,
              "warrantyType":this.year,
              "invoicePhotoUrl":this.invoiceImgUrl
            }
            this.pageid=pageid;
            this.uploadedFile='';
            this._api.getProductIcon(this.category).subscribe(
          res => {
            if(res.message === 'Success') {
              this.productImgUrl.push(environment.hosted_api_url+"icons/"+res.icon.icon);
              this.uploadedFile = environment.hosted_api_url+"icons/"+res.icon.icon;
              localStorage.setItem('productImgUrl',this.productImgUrl);
            }
          }
        )
  // }  
   }else if (this.myVar1==true){
      // if(this.modelId==''){
      //     this.helper.showErrorCustom('Please enter product model no')
      // }else{
          let value = {
              "modelNo": this.modelId,
              "purchaseDate": (this.purchaseDate ?? ''),
              "serialNo": this.serialNo,
              "warrantyPeriod": this.warrantyPeriod,
              "warrantyType":this.year,
              "invoicePhotoUrl":this.invoiceImgUrl
            }
            this.pageid = pageid;
            this.uploadedFile='';
            this._api.getProductIcon(this.category).subscribe(
          res => {
            if(res.message === 'Success') {
              this.productImgUrl.push(environment.hosted_api_url+"icons/"+res.icon.icon);
              this.uploadedFile = environment.hosted_api_url+"icons/"+res.icon.icon;
              localStorage.setItem('productImgUrl',this.productImgUrl);
            }
          }
        )
    //}  
   }
      
}
   setDate(){
    this.purchaseDate=String(this.datePipe.transform(this.purchaseDate,"yyyy-MM-dd"));
    console.log("purchase",this.purchaseDate);
   }

   async selectImageOption() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [{
                text: 'Take a Photo',
                icon: 'camera-outline',
                handler: () => {
                    // TestFairy.log('>>>>>>>>>>> CAMERA SELECTED');
                    console.log('>>>>>>>>>>> CAMERA SELECTED');
                    this.takePhoto(1);
                    // this.selectImageAction(this.camera.PictureSourceType.CAMERA);
                }
            }, {
                text: 'Pick From Gallery',
                icon: 'image-outline',
                handler: () => {
                    // TestFairy.log('>>>>>>>>>>> GALLERY SELECTED');
                    console.log('>>>>>>>>>>> GALLERY SELECTED');
                     this.takePhoto(0);//photo library
                    // this.selectImageAction(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                icon: 'close',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }
    goBack() {
        
        if (this.pageid==0) {
          this.navCtrl.back();
        }
        if (this.pageid==111) {
          this.pageid=0
        }
        if (this.pageid==222) {
          this.pageid=111
        }
    }
    cross() {
        
        
          this.navCtrl.back();
        
    }


  takePhoto(sourceType:number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.img ="data:Image/*;base64,"+imageData;
      if (this.imageURI!="") {
        this.showLoader();
      const fileTransfer: FileTransferObject = this.transfer.create();
       let newName = `${new Date().getTime()}`;
      let options1: FileUploadOptions = {
        fileKey: 'file',
        fileName: newName + '_mood.jpg',
        chunkedMode: false,
        mimeType: "multipart/form-data", // add mimeType
        headers: {}
      }

      fileTransfer.upload(this.imageURI, 'http://cp-33.hostgator.tempwebhost.net/~a1627unp/wevouch/upload.php', options1)
      .then((data2) => {
        // this.uploadedFile=this.img;
        // console.log(data2.response + " Uploaded Successfully");
        let value=data2.response;
        // console.log(JSON.parse(value));
        // console.log(value['file_link']);
        // console.log((JSON.parse(value))['file_link']);
        this.helper.showErrorCustom('Image Uploaded Successfully')
        this.invoiceImgUrl.push(JSON.parse(value)['file_link']);
        // console.log(this.uploadedFile + "uploadedFile Uploaded Successfully");
        localStorage.setItem('invoiceImgUrl',JSON.parse(value)['file_link']);
        this.hideLoader();
      }, (err) => {
        // console.log(JSON.stringify(err));
      });
      }
    }, (err) => {
      // Handle error
    });
  }
     async selectImageOption2() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [{
                text: 'Take a Photo',
                icon: 'camera-outline',
                handler: () => {
                    // TestFairy.log('>>>>>>>>>>> CAMERA SELECTED');
                    // console.log('>>>>>>>>>>> CAMERA SELECTED');
                    this.takePhoto2(1);
                    // this.selectImageAction(this.camera.PictureSourceType.CAMERA);
                }
            }, {
                text: 'Pick From Gallery',
                icon: 'image-outline',
                handler: () => {
                    // TestFairy.log('>>>>>>>>>>> GALLERY SELECTED');
                    // console.log('>>>>>>>>>>> GALLERY SELECTED');
                     this.takePhoto2(0);//photo library
                    // this.selectImageAction(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                icon: 'close',
                handler: () => {
                    // console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }
    takePhoto2(sourceType:number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.img ="data:Image/*;base64,"+imageData;
      if (this.imageURI!="") {
        this.showLoader();
      const fileTransfer: FileTransferObject = this.transfer.create();
       let newName = `${new Date().getTime()}`;
      let options1: FileUploadOptions = {
        fileKey: 'file',
        fileName: newName + '_mood.jpg',
        chunkedMode: false,
        mimeType: "multipart/form-data", // add mimeType
        headers: {}
      }

      fileTransfer.upload(this.imageURI, 'http://cp-33.hostgator.tempwebhost.net/~a1627unp/wevouch/upload.php', options1)
      .then((dataImg) => {
        this.helper.showErrorCustom('Image Uploaded Successfully')
          let value=dataImg.response;
          // console.log((JSON.parse(value))['file_link']);
          // this.productImgUrl = JSON.parse(value)['file_link'];
          // this.uploadedFile=this.productImgUrl;
          // console.log(this.uploadedFile + "productImgUrl Uploaded Successfully");
          this.productImgUrl.push(JSON.parse(value)['file_link']);
          localStorage.setItem('productImgUrl',JSON.parse(value)['file_link']);

        // }
        this.hideLoader();
      }, (err) => {
        // console.log(JSON.stringify(err));
      });
      }
    }, (err) => {
      // Handle error
    });
  }
    
  removeImage(imageIndex : any) {
    this.productImgUrl.splice(imageIndex, 1);
    // console.log(this.productImgUrl);
  }

  removeInvoiceImage(imageIndex : any) {
    this.invoiceImgUrl.splice(imageIndex, 1);
    // console.log(this.invoiceImgUrl);
  }
}