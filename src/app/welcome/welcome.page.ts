import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor() { }

  @ViewChild('mySlider')  slides: IonSlides;

  swipeNext(){
    this.slides.slideNext();
  }

  ngOnInit() {
  }

}
