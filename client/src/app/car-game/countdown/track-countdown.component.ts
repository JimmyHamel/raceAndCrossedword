import { Component, OnInit } from "@angular/core";
import { TrackCountdownService, COUNTDOWN_INITIAL_VALUE } from "./track-countdown.service";

const IS_SELECTED: boolean = true;
@Component({
  selector: "app-track-countdown",
  templateUrl: "./track-countdown.component.html",
  styleUrls: ["./track-countdown.component.css"]
})

export class TrackCountdownComponent implements OnInit {

  public countdownValue: number;
  public countdownValues: boolean[];
  public constructor(private countdownService: TrackCountdownService) {
    this.countdownValues = [];
  }

  public ngOnInit(): void {
    this.countdownService.countdownObservable.subscribe((countdownValue) => {
      this.countdownValue = countdownValue;
      for (let i: number = 0; i < COUNTDOWN_INITIAL_VALUE; i++) {
        this.countdownValues[i] = !IS_SELECTED;
      }
      this.countdownValues[this.countdownValue] = IS_SELECTED;
    });
  }

}
