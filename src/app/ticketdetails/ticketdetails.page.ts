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
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.page.html',
  styleUrls: ['./ticketdetails.page.scss'],
})
export class TicketdetailsPage implements OnInit {
public ticketId: any = ''; 
  public ticketDetail: any = {};
  public ticketLogs: any = [];
  public userDetail: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router) { }

  ngOnInit() {
  	this.ticketId = localStorage.getItem('ticket_id');
    this.getTicketDetail(this.ticketId);
  }
getTicketDetail(ticketId : any) {
    console.log(ticketId);
    this._api.ticketDetail(ticketId).subscribe(
      res => {
        console.log(res);
        this.ticketDetail = res
        this.hideLoader();
      }, err => {}
    );
    this._api.getTicketLog(ticketId).subscribe(
      res => {
        // console.log('Logs :',res);
        this.ticketLogs = res.filter((t : any) => t.logType === "Go To Customer");
        console.log('Logs :',this.ticketLogs);
      }, err => {}
    )
  }

  deleteTicket(ticketId :any) {
        this.showLoader();
        this._api.ticketDelete(ticketId).subscribe(
          res => {
            console.log(res);
            const notificationForm = {
              "title": "Ticket Deleted", 
              "userId": this.userDetail._id, 
              "description": "Ticket "+this.ticketDetail.uniqueId+" has deleted."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
            this.hideLoader();
            this._router.navigate(['/ticket/list']);
          }, err => {}
        )
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
  openMenu() {
        this.menu.enable(true, 'content');
        this.menu.open('content');
    }

    openNotification() {
        this.menu.enable(true, 'notification');
        this.menu.open('notification');
    }
    goBack() {
        this.navCtrl.back();
    }
}
