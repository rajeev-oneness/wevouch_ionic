import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage implements OnInit {

  public notificationList : any = [];
  public userInfo : any = {};

  constructor(private _api : ApiService) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  }

  ngOnInit() {
    this.getNotifications(); // getting Notification
  }

  getNotifications() {
    if(this.userInfo?._id) {
        this._api.notificationList(this.userInfo._id).subscribe(
          res => {
            let array = Array();
            for (let index = (res.length-1); index >= 0; index--) {
              if (res[index].cleared == false) {
                array.push(res[index]);
              }
            }
            this.notificationList = array;
            console.log('Notification List',this.notificationList);
          }, err => {}
        )
    }
  }

    // Marking as a Read or Unread
    markingNotificationAsRead(notificationId = ''){
      this._api.notificationMarkAsRead(this.userInfo._id,notificationId,false).subscribe(
        res => {
          if(res.error == false){
            this.getNotifications();
          }
          // console.log('Notification Marked as Read',res);
        }
      )
    }

}
