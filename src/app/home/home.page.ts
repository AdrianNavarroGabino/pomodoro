import { Component } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { now } from '@ionic/core/dist/types/utils/helpers';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public timer: number = 25;
  public currentMinutes: string;
  public currentSeconds: string;
  public start: Date;

  constructor(private pickerCtrl: PickerController) {}

  ngOnInit() {
    const start = localStorage.getItem("start");
    
    if(start) {
      this.start = new Date(start);
      if(((new Date()).getTime() - this.start.getTime()) / 1000 / 60 > 25) {
        localStorage.removeItem("start");
        this.start = null;
      }
      else {
        this.playPomodoro();
      }
    }
  }

  pomodoro() {
    localStorage.setItem("start", (new Date()).toString());
    this.start = new Date();
    this.playPomodoro();
  }

  async playPomodoro() {
    setInterval(() => {
      this.calculateTime();
    }, 1000);
  }

  calculateTime() {
    const now = new Date();
    this.currentMinutes = ((this.timer - ((now.getTime() - this.start.getTime()) / 1000 / 60) | 0)).toString().padStart(2, "0");
    this.currentSeconds = ((60 - ((now.getTime() - this.start.getTime()) / 1000 % 60) | 0)).toString().padStart(2, "0");
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'timer',
          options: [
            {
              text: '25 minutes',
              value: '25',
            },
            {
              text: '15 minutes',
              value: '15',
            },
            {
              text: '5 minutes',
              value: '5',
            }
          ]
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.timer = value.timer.value;
          },
        },
      ],
    });

    await picker.present();
  }
}
