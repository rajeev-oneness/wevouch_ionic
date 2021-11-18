import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperProvider } from 'src/app/service/helper.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-amc',
  templateUrl: './amc.page.html',
  styleUrls: ['./amc.page.scss'],
})
export class AmcPage implements OnInit {
  public startDate: any = [];
  public mobileNo: any = []; 
   public noOfYears: any = [];
     public serviceProvider: any = [];
     vendorNo: any = [];
     serviceDuration: any = [];
     openamcData: any = [];
    amcImages : any= [];
    imageURI = '';
    img = '';
  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,private datePipe: DatePipe,
    public actionSheetController: ActionSheetController,
        private camera: Camera,
        private crop: Crop,
        private file: File,
        private sanitizer: DomSanitizer,
        private transfer: FileTransfer,
         public helper: HelperProvider) { }

  dismiss() {
    let value = {
              "mobileNo": this.mobileNo,
              "noOfYears": this.noOfYears,
              "serviceProvider": this.serviceProvider,
              "startDate": this.startDate,
            "serviceDuration": this.serviceDuration,
              "vendorNo": this.vendorNo,
              "amcImages" : this.amcImages
            }
       this.modalController.dismiss(value);
  }

  ngOnInit() {
    this.mobileNo=localStorage.getItem('mobileNoamc');
    this.serviceProvider=localStorage.getItem('serviceProvideramc');
    this.startDate=localStorage.getItem('startDateamc');
    this.noOfYears=localStorage.getItem('noOfYearsamc');
    this.serviceDuration=localStorage.getItem('serviceDurationamc');
    this.vendorNo=localStorage.getItem('vendorNoamc');
  }
  async selectImageOption() {
    const actionSheet = await this.actionSheetController.create({
        buttons: [{
            text: 'Take a Photo',
            icon: 'camera-outline',
            handler: () => {
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
          console.log(JSON.parse(value));
          // console.log(value['file_link']);
          // console.log((JSON.parse(value))['file_link']);
          this.helper.showErrorCustom('Image Uploaded Successfully')
          console.log(value['file_link']);
          console.log((JSON.parse(value))['file_link']);
          this.amcImages.push(JSON.parse(value)['file_link']);
          localStorage.setItem('extendedWarrantyImages',JSON.parse(value)['file_link']);
          this.hideLoader();
        }, (err) => {
          // console.log(JSON.stringify(err));
        });
        }
      }, (err) => {
        // Handle error
      });
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
      this.loadingController.dismiss().then((res) => {
      }).catch((error) => {
        console.log('error', error);
      });
    }

    removeAmcImage(imageIndex){
      this.amcImages.splice(imageIndex, 1);
    }
  
}
