import { Injectable } from "@angular/core";
import { TrackService } from "../track-list/track.service";
import { Highscore } from "../../../../../common/interface/highscore-interface";

const NO_TIME: number = 0;
@Injectable()
export class HighscoreService {
  public oldHighScore: number;
  public newTime: number;

  public constructor(public trackService: TrackService) {
    this.oldHighScore = NO_TIME;
    this.newTime = NO_TIME;
  }

  public updateScores(time: number): void {
    this.newTime = time;
    this.oldHighScore = this.trackService.currentTrack.highscores[0].time;
  }

  public updateHighScores(name: string): void {
    const newScore: Highscore = { time: this.newTime, by: name };
    this.getHighScores().push(newScore);
    this.getHighScores().sort((h1: Highscore, h2: Highscore) => h1.time - h2.time);

    if (this.getHighScores()[0].time === NO_TIME) {
      this.getHighScores().shift();
    } else {
      this.getHighScores().pop();
    }
    this.pushNewHighScore();
  }

  private pushNewHighScore(): number {
    let status: number;
    this.trackService.updateTrack(this.trackService.currentTrack).subscribe((serverResponse) => {
      status = serverResponse.status;
    });

    return status;
  }

  public getHighScores(): Highscore[] {
    return this.trackService.currentTrack.highscores;
  }

}
