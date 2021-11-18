import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
  	private platform: Platform,
    private navCtrl: NavController,
    public router: Router,
    private alertCtrl: AlertController,
    private _location: Location,) {
  	this.initializeApp();
  }
    initializeApp() {
    this.platform.ready().then(() => {
      if (localStorage.getItem("userInfo")) {
          this.navCtrl.navigateRoot('/menu/tabs/tabs/home');
      } else {
        this.router.navigate(['/welcome']);
      }

      this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
        if (this._location.isCurrentPathEqualTo('/menu/tabs/tabs/home')) {
          processNextHandler();
        } else {
          // Navigate to back page
          // console.log('Navigate to back page');
          this._location.back();
        }
      });

      this.platform.backButton.subscribeWithPriority(5, () => {
        // console.log('Handler called to force close!');
        this.alertCtrl.getTop().then(r => {
          if (r) {navigator['app'].exitApp();}
        }).catch(e => {console.log(e);})
      });
    });
  }
}
