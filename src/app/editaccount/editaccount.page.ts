import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";
import { environment } from "src/environments/environment";
import { LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperProvider } from 'src/app/service/helper.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-editaccount',
  templateUrl: './editaccount.page.html',
  styleUrls: ['./editaccount.page.scss'],
})
export class EditaccountPage implements OnInit {
public userDetail : any = {};
  public errorMessage : any = '';
  public passwordErrorMessage : any = '';
  public user_id : any = '';
  public uploadedFile:any = '';
  public profilePicUrl:any = '';
  public confirmPassword:any = '';
  images: any;
  base64Image: any;
  childImg: string = '';
  title = '';
  content = '';
  imageURI = '';
  userDetails:any;
  img = '';
  imageUrl:any;
  lastName = '';
  firstName = '';
  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  public invoiceImgUrl : any = '';
  public productImgUrl : any = '';
  constructor(public viewCtrl: ModalController,
  	 private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router,public helper: HelperProvider,public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
  private camera: Camera,
        private crop: Crop,
        private file: File,
        private sanitizer: DomSanitizer,) { }

  ngOnInit() {
  	let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.user_id = user._id;
    this.uploadedFile = user.image;
    this.profilePicUrl = user.image;
    localStorage.setItem('profile_img',this.uploadedFile);
    console.log(localStorage.getItem('profile_img'))
    this.getUser(user._id);
  }
getUser(userId : any) {
  this.showLoader();
  this.lastName='';
  this.firstName='';
    this._api.userDetails(userId).subscribe(
      res => {
        this.userDetail = res;
        console.log('details',res);
        let name = this.userDetail.name.split(' ');
        this.lastName = name[name.length-1];
        for(let i = 0; i < name.length - 1; i++) {
          if (i > 0) {
            this.firstName += ' ';
          }
          this.firstName += name[i];
        }
        this._api.updateUserLocally(res);
        this.hideLoader();
      }, err => {}
    )
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

  updateUser() {
    this.errorMessage = '';
    if (this.userDetail.age=="") {
    this.helper.showErrorCustom("Please enter your age")
  }else if (this.userDetail.gender=="") {
    this.helper.showErrorCustom("Please enter your gender")
  }else if (this.userDetail.mobile=="") {
    this.helper.showErrorCustom("Please choose your mobile")
  }else if (this.firstName=="") {
    this.helper.showErrorCustom("Please enter your first name")
  // }else if (this.lastName=="") {
  //   this.helper.showErrorCustom("Please enter your last name")
  }else{
  this.showLoader();
	let mainForm = {
        "age":this.userDetail.age,
				"gender": this.userDetail.gender,
				"mobile": this.userDetail.mobile,
				"name": this.firstName+' '+this.lastName,
				"image": localStorage.getItem('profile_img'),
				
            }
      this._api.updateUserDetails(this.user_id, mainForm).subscribe(
        res => {
          this.errorMessage = res.message;
          this.getUser(this.user_id);
          this.hideLoader();
          this.helper.showErrorCustom('Profile Updated Successfully');
          const notificationForm = {
            "title": 'Profile Updated Successfully',
            "userId": this.userDetail._id,
            "description": "Dear "+this.userDetail.name+", your profile has updated successfully.",
          }
          this._api.addNotification(notificationForm).subscribe();
          this.navCtrl.navigateForward('/account')
        },
        err => {
          this.errorMessage = "something went wrong please check credentials and try after sometimes";
          // this._loader.stopLoader('loader');
                    this.helper.showErrorCustom(this.errorMessage)
          this.hideLoader();
        }
        
      )
    }
}
goBack() {
    this.navCtrl.back();
}
   async selectImageOption() {
        const actionSheet = await this.actionSheetController.create({
            mode: 'ios',
            buttons: [{
                text: 'Camera',
                handler: () => {
                    // TestFairy.log('>>>>>>>>>>> CAMERA SELECTED');
                    console.log('>>>>>>>>>>> CAMERA SELECTED');
                    this.takePhoto(1);
                    // this.selectImageAction(this.camera.PictureSourceType.CAMERA);
                }
            }, {
                text: 'Gallery',
                handler: () => {
                    // TestFairy.log('>>>>>>>>>>> GALLERY SELECTED');
                    console.log('>>>>>>>>>>> GALLERY SELECTED');
                     this.takePhoto(0);//photo library
                    // this.selectImageAction(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
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
        // this.uploadedFile=this.img;
        console.log(data2.response + " Uploaded Successfully");
        let value=data2.response;
        console.log((JSON.parse(value))['file_link']);
        this.helper.showErrorCustom('Image Uploaded Successfully')
          this.invoiceImgUrl = JSON.parse(value)['file_link'];
          this.uploadedFile=this.invoiceImgUrl;
          console.log(this.uploadedFile + "uploadedFile Uploaded Successfully");
          localStorage.setItem('profile_img',JSON.parse(value)['file_link']);
        this.hideLoader();
      }, (err) => {
        console.log(JSON.stringify(err));
      });
      }
    }, (err) => {
      // Handle error
    });
  }
}

