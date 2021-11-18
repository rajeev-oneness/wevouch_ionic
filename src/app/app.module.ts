import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {ExtendedwarrantyPageModule} from './extendedwarranty/extendedwarranty.module';
import {AmcPageModule} from './amc/amc.module';
import {AddaddressPageModule} from './addaddress/addaddress.module';
import {ProductdetailsPageModule} from './productdetails/productdetails.module';
import { HttpClientModule } from '@angular/common/http';
import { HelperProvider } from './service/helper.service';
import { FormsModule } from '@angular/forms';
import { DatePipe} from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { NgOtpInputModule } from  'ng-otp-input';
import { Facebook } from '@ionic-native/facebook/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
  HttpClientModule,
  FormsModule,
   IonicModule.forRoot(), 
   AppRoutingModule,
    ExtendedwarrantyPageModule,
     AmcPageModule, 
     NgOtpInputModule,
     AddaddressPageModule, ProductdetailsPageModule],
  providers: [
  { provide: RouteReuseStrategy, 
  	useClass: IonicRouteStrategy }, 
	DatePipe,
	HelperProvider,
	FileTransfer,
  // FileUploadOptions,
  FileTransferObject,
  File,
  Camera,
	Crop,
  Facebook,
      InAppBrowser, // Set InAppBrowser here,
CallNumber,
PhotoViewer,
SocialSharing
	// FileTransfer,

],
  bootstrap: [AppComponent],
})
export class AppModule {}
