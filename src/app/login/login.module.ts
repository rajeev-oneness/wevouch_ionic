import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
//import { SocialLoginModule, FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  // providers : [
  //   {
  //     provide: 'SocialAuthServiceConfig',
  //     useValue: {
  //       autoLogin: false,
  //       providers: [
  //         {
  //           id: GoogleLoginProvider.PROVIDER_ID,
  //           provider: new GoogleLoginProvider(
  //             '735488008597-ulevdo2cq8pe45bg0b1i8idbvp9u5fs3.apps.googleusercontent.com'
  //           )
  //         },
  //         {
  //           id: FacebookLoginProvider.PROVIDER_ID,
  //           provider: new FacebookLoginProvider('563456771406347')
  //         }
  //       ]
  //     } as SocialAuthServiceConfig,
  //   }
  // ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
