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
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
	
	ticketslideOpts = {
		slidesPerView: 1.1,
	    initialSlide: 0,
	    speed: 400,
	    spaceBetween: 14
  	};
  constructor(public modalController: ModalController, private navCtrl: NavController,
        private menu: MenuController, private _api:ApiService,public loadingController: LoadingController, 
    public _router:Router) { 
    this.menu.enable(false);
  }
public user : any = {}
  public tickets : any = ''
  public categories : any = {}
  public defaultCategoryId : any = '';


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.hideLoader();
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(userData._id);
    // this._api.categoryList().subscribe(
    //   res => {
    //     this.categories = res.filter((t : any) => t.status === 'active');
    //     console.log('categories', res);
    //     this.defaultCategoryId = res[0]._id;
    //     this.fetchTicketByCategory(this.defaultCategoryId);
    //   }, err => {}
    // )
  }
  ionViewWillEnter(){
    this.hideLoader();
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(userData._id);
  }
  
  getUser(userId : any) {
    this._api.userDetails(userId).subscribe(
      res => {
        this.user = res;
        this.getTickets();
      }
    )
  }

  getTickets() {
    this._api.ticketList(this.user._id).subscribe(
      res => {
        this.tickets = res
        // console.log('Ticket Lists',this.tickets);
        this.hideLoader();
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
openMenu() {
        this.menu.enable(true, 'content');
        this.menu.open('content');
    }

    openNotification() {
        this.menu.enable(true, 'notification');
        this.menu.open('notification');
    }
  // Hide the loader if already created otherwise return error
  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }

ticketDetails(_id){
  localStorage.setItem('ticket_id',_id);
  this.navCtrl.navigateForward('/ticketdetails');
}
}
