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
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperProvider } from 'src/app/service/helper.service';
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.page.html',
  styleUrls: ['./editproduct.page.scss'],
})
export class EditproductPage implements OnInit {
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
  public modelList: any = [];
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
  public serialNo : string = '';
  public year : string = '';
  public warrantyPeriod : string = '';
  public images: any;
  public base64Image: any;
  public childImg: string = '';
  public getDateFormat = getDateFormat;
  public productId: any = '';
  public productDetail: any = [];
  public purchaseDateTime: any = '';
  public amcStartDate: any = '';
  public extendedWarrantyStartDate: any = '';
  public extendedWarrantyEndDate: any = '';
  public uploadedFile1: any ='';
  public uploadedFile2: any ='';
  public userDetail: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public secondTimeCall: boolean = false;
  public warrantyTime : any = '';
  public warrantyMode : any = 'year';
  public title = '';
  public content = '';
  public imageURI = '';
  public userDetails : any;
  public img = '';
  public imageUrl:any;
  public uploadedFile: any ='';
  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  public invoiceImgUrl :  any = new Array();
  public productImgUrl  : any = new Array();
  public otherModel : any = '';
  public otherModel2 : any = '';
  public index : number = 0;
  public category2 : any = '';
  public subCategory2 : any = '';
  public myVar1=false;
  public sectionHide = 1;
  constructor(
        public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
        public _router:Router,private datePipe: DatePipe,
        public actionSheetController: ActionSheetController,
        private camera: Camera,private crop: Crop,private file: File,
        private sanitizer: DomSanitizer,public helper: HelperProvider,
        private transfer: FileTransfer,
  ){ }

  public otherBrand : any = '';public otherCategory : any = '';public otherSubCategory : any = '';
  ngOnInit() {
    this.userDetail = JSON.parse(localStorage.getItem('userInfo') || '{}');
  	this.productId=localStorage.getItem('product_id');
    this._api.productDetail(localStorage.getItem('product_id')).subscribe(
      res => {
        this.hideLoader();
        // console.log('Product Info',res);
    		this.name = res['name'];
    		this.category = res['category'];
    		this.brandId = res['brandId'];
        this.otherBrand = res?.brands;
    		this.userPhn = res['registeredMobileNo'];
    		this.subCategory = res['subCategory'];
    		this.purchaseDate = res['purchaseDate'];
    		this.serialNo = res['serialNo'];
    		this.warrantyPeriod = res['warrantyPeriod'];
    		this.year = res['warrantyType'];
    		this.invoiceImgUrl = res['invoicePhotoUrl'];
    		this.productImgUrl = res.productImagesUrl;
        this.productDetail = res;
        this.modelId = res.modelNo;
        this.otherModel = res.modelNo;
        this.year = 'month';
        this.fetchBrands();
        if (res['purchaseDate']==undefined) {
          this.myVar1=true;
          this.sectionHide=0;
        }
        if(res.warrantyPeriod%12 === 0){
          this.warrantyTime = res.warrantyPeriod/12;
        } 
        else {
          this.warrantyTime = res.warrantyPeriod;
          this.warrantyMode = 'month';
        }
        if(res.purchaseDate) {
          this.purchaseDateTime = getDateFormat(res.purchaseDate);
        }
        if (res.amcDetails || res.extendedWarranty) {
          this.amcStartDate = getDateFormat(res.amcDetails?.startDate);
          this.extendedWarrantyStartDate = getDateFormat(res.extendedWarranty?.startDate);
          this.extendedWarrantyEndDate = getDateFormat(res.extendedWarranty?.endDate);
        }
        this.invoiceImgUrl = res.invoicePhotoUrl;
        if (res.invoicePhotoUrl != null) {
          this.uploadedFile1 = res.invoicePhotoUrl;
        }
        if (res.productImagesUrl[0] != null) {
            this.uploadedFile2 = res.productImagesUrl[0];
        }
        // console.log('amcDetails',res?.amcDetails )
        if (res?.amcDetails != null) {
            // console.log('extendAMC Details',res.amcDetails)
            localStorage.setItem('mobileNoamc',res.amcDetails.mobileNo);
            localStorage.setItem('serviceProvideramc',res.amcDetails.serviceProvider);
            localStorage.setItem('startDateamc',res.amcDetails.startDate);
            localStorage.setItem('noOfYearsamc',res.amcDetails.noOfYears);
            localStorage.setItem('serviceDurationamc',res.amcDetails.serviceDuration);
            localStorage.setItem('vendorNoamc',res.amcDetails.vendorNo);
        }
        if (res?.extendedWarranty != null) {
          // console.log('extendedWarranty',res.extendedWarranty);
          localStorage.setItem('mobileNoExtendWarrenty',res.extendedWarranty.mobileNo);
          localStorage.setItem('serviceProviderExtendWarrenty',res.extendedWarranty.serviceProvider);
          localStorage.setItem('startDateExtendWarrenty',res.extendedWarranty.startDate);
          localStorage.setItem('noOfYearsExtendWarrenty',res.extendedWarranty.noOfYears);
        }

      }, err => {}
    )
  }

  remember() {
   if (this.myVar1==false) {
     this.sectionHide=0;
   }else{
     this.sectionHide=1;
   }
   //console.log(this.myVar1); 
  }

  fetchBrands() {
    this._api.getProductBrands().subscribe(
      res => {
        this.brandList = res.brands;
        this.brandList.push({id : '0',name : "Others"});
        this.brandId = res.brands.filter((t : any) => t.name === this.productDetail.brands)[0]?.id;
        this.checkRealModalSelectedByRajeev('brandId');
        this.fetchCategory(2);
      }, err => {}
    )
  }
  
  fetchCategory(callTime : any = '') {
    this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0]?.name;
    this._api.getProductCategories(this.brandId).subscribe(
      res => {
        this.categoriesList = res.categories;
        if(this.categoriesList?.length > 0){
          this.categoriesList.push({category : 'Others'});
        }else{
          this.categoriesList = [{category : 'Others'}];
        }
        this.checkRealModalSelectedByRajeev('category');
        if (callTime != '') {
          this.secondTimeCall = true;
        }
        this.fetchSubCategory(2);
        this.hideLoader();
      }, err => {}
    )
  }
  
  fetchSubCategory(callTime : any = '') {
    this._api.getProductSubCategories(this.category).subscribe(
      res => {
        this.subCategoriesList = res.sub_categories;
        if(this.subCategoriesList?.length > 0){
          this.subCategoriesList.push({sub_category : 'Others'});
        }else{
          this.subCategoriesList = [{sub_category : 'Others'}];
        }
        if(this.subCategory != ''){
          this.checkRealModalSelectedByRajeev('subCategory');
        }
        
        this.fetchModel();
      }, err => {}
    )
  }

  fetchModel(callTime : any = '') {
    this._api.getProductModels(this.subCategory).subscribe(
      res => {
        this.modelList = res.models;
        if(this.modelList?.length > 0){
          this.modelList.push({'model_no' : "Others"});
        }else{
          this.modelList = [{'model_no' : "Others"}];
        }
        if (!this.userExists(this.modelId)) {
          this.otherModel= this.modelId;
        }
        this.checkRealModalSelectedByRajeev('modelId');
        this.hideLoader();
      }
    )
  }

  checkRealModalSelectedByRajeev(params){
    if(params == 'modelId'){
      var itemInfo = this.modelList.find(models => models.model_no === this.modelId);
      if(itemInfo == undefined){
        this.modelId = 'Others';
      }
    }
    if(params == 'brandId'){
      var itemInfo = this.brandList.find(brands => brands.id === this.brandId);
      if(itemInfo == undefined){
        // this.otherBrand = this.brandId;
        this.brandId = '0';
      }else if(itemInfo.id == 0 || itemInfo.id == '0'){
        this.otherBrand = 'Others';
        this.brandId = '0';
      }
    }
    if(params == 'category'){
      var itemInfo = this.categoriesList.find(categories => categories.category === this.category);
      if(itemInfo == undefined){
        this.otherCategory = this.category;
        this.category = 'Others';
      }
    }
    if(params == 'subCategory'){
      var itemInfo = this.subCategoriesList.find(subcategories => subcategories.sub_category === this.subCategory);
      if(itemInfo == undefined){
        this.otherSubCategory = this.subCategory;
        this.subCategory = 'Others';
      }
    }
  }

 userExists(username) {
  return this.modelList.some(function(el) {
    return el.model_no === username;
  }); 
}
  fetchModel2(callTime : any = '') {
    this._api.getProductModels(this.subCategory).subscribe(
      res => {
        this.modelList = res.models;
        this.modelList.push({'model_no' : "Others"});

        // if (callTime != '' || this.secondTimeCall) {
        //   this.modelId = res.models[0].model_no;
        // }
        this.hideLoader();
        // console.log("models:",this.modelList);
      }
    )
  }

  onSelectFile(event: any) {
    // this.showLoader();
    this.fileFormatError = '';this.hasFile = false;
    this.selectedFile = event.target.files[0];
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
    // console.log(file);
    this._api.storeFile(mainForm).subscribe(
      res => {
        // console.log(res);
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
        this.addProductValue = formData.value;
        this.productTab = false;
        this.warantyTab = true;
        this.finishTab = false;
        this.thankYouTab = false;
        this.errorMessage = "";
      } else {
        this.errorMessage = 'Please fill out all the details';
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }

  addWaranty(formData : any) {
    this.errorMessage = "";
    window.scrollTo(0, 0);
    if (formData?.valid) {
        this.addProductValue.purchaseDate = formData.value.purchaseDate;
        this.addProductValue.serialNo = formData.value.serialNo;
        this.addProductValue.modelNo = formData.value.modelNo;
        if (formData.value.warrantyType === 'year') {
          this.addProductValue.warrantyPeriod =
            Number(formData.value.warrantyPeriod) * 12;
        } else {
          this.addProductValue.warrantyPeriod =
            formData.value.warrantyPeriod || 0;
        }
        if(this.extdWarrantyStatus === true && this.amcStatus === true) {
          this.productTab = false;
          this.warantyTab = false;
          this.finishTab = true;
          this.thankYouTab = false;
          this.uploadedFile = '';
          this.errorMessage = "";
          this.fileFormatError = "";
        } else {
          this.errorMessage = "Please fill Extended warranty and amc details"
        }
        this._api.getProductIcon(this.category).subscribe(
          res => {
            console.log('product icon: ',res);
            if(res.message === 'Success') {
              this.productImgUrl = environment.hosted_api_url+"icons/"+res.icon.icon;
              this.uploadedFile = environment.hosted_api_url+"icons/"+res.icon.icon;
            }
          }
        )
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
      // console.log(formData.value);
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
      // console.log(formData.value);
      this.addProductValue.amcDetails = formData.value;
      // this.addProductValue.amcDetails.enddate = formData.value;
      this.amcStatus = true;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  
  addFinish() {
    // this.showLoader();
    let value;
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
    value = {
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
          "userId": JSON.parse(localStorage.getItem('userInfo') || '{}')._id
      }
      this._api.updateProduct(this.productId,value).subscribe(
      (res) => {
          const userDetail = JSON.parse(localStorage.getItem('userInfo') || '{}')
          this.hideLoader();
          // this.helper.showErrorCustom('Product ‘'+this.name+'’ updated successfully');
          this.helper.showErrorCustom('Product '+this.name+' updated successfully');
          const notificationForm = {
            "title": "Product is updated", 
            "userId": this.userDetail?._id,
            "description": "Dear "+this.userDetail.name+", your Product "+this.productDetail?.name+" successfully updated.",
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
          this.cross();
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
    modal.onDidDismiss().then((data) => {
        var user = data['data'];
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
    modal.onDidDismiss().then((data) => {
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
      // console.log('Loading dismissed!', res);
    }).catch((error) => {
      // console.log('error', error);
    });
  }

  productPage2(pageid){
    if (this.userPhn==null) {
      this.helper.showErrorCustom('Please enter your phone number')
    }else{
      let value = {
          category : this.name,
          brandId : this.brandId,
          name : this.name,
          registeredMobileNo : this.userPhn,
          subCategory : this.subCategory,
      }
      this.pageid = pageid;
      // console.log(value)
    }
  }

 productPage3(pageid){
    if (this.userPhn==null) {
        this.helper.showErrorCustom('Please enter your phone number')
    }else{
        let value = {
            modelNo : this.modelId,
            purchaseDate : this.purchaseDate,
            serialNo : this.serialNo,
            warrantyPeriod : this.warrantyPeriod,
            warrantyType : this.year,
            invoicePhotoUrl : this.invoiceImgUrl
        }
        this.pageid = pageid;
        this.uploadedFile = '';
    }
  }

   setDate(){
    this.purchaseDate=String(this.datePipe.transform(this.purchaseDate,"yyyy-MM-dd"));
    // console.log(this.purchaseDate);
   }

   async selectImageOption() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [{
                text: 'Take a Photo',
                icon: 'camera-outline',
                handler: () => {
                    this.takePhoto(1);
                }
            }, {
                text: 'Pick From Gallery',
                icon: 'image-outline',
                handler: () => {
                     this.takePhoto(0);//photo library
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                icon: 'close',
                handler: () => {}
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
        let value=data2.response;
        this.hideLoader();
        this.helper.showErrorCustom('Image Uploaded Successfully')
          this.uploadedFile1=this.invoiceImgUrl;
          this.invoiceImgUrl.push(JSON.parse(value)['file_link']);
          localStorage.setItem('invoiceImgUrl',JSON.parse(value)['file_link']);
      }, (err) => {});
      }
    }, (err) => {});
  }
     async selectImageOption2() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [{
                text: 'Take a Photo',
                icon: 'camera-outline',
                handler: () => {
                  this.takePhoto2(1);
                }
            }, {
                text: 'Pick From Gallery',
                icon: 'image-outline',
                handler: () => {
                  this.takePhoto2(0);//photo library
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
      .then((data2) => {
        this.helper.showErrorCustom('Image Uploaded Successfully')
          let value=data2.response;
          console.log((JSON.parse(value))['file_link']);
          this.uploadedFile2=this.productImgUrl;
          console.log(this.uploadedFile + "productImgUrl Uploaded Successfully");
          this.productImgUrl.push(JSON.parse(value)['file_link']);
          this.hideLoader();
          localStorage.setItem('productImgUrl',JSON.parse(value)['file_link']);
      }, (err) => {});
      }
    }, (err) => {});
  }

  removeImage(imageIndex : any) {
    this.productImgUrl.splice(imageIndex, 1);
    console.log(this.productImgUrl);
  }

  removeInvoiceImage(imageIndex : any) {
    this.invoiceImgUrl.splice(imageIndex, 1);
    console.log(this.invoiceImgUrl);
  }

}
