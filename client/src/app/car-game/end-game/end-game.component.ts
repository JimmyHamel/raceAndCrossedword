import { Component, OnInit } from "@angular/core";
import { EndGameService } from "./end-game.service";
import { HighscoreService } from "./highscore.service";
import { PLAY_URL, ID_PARAM } from "../../../../../common/communication/communication-url";
import { TimeFormat } from "../lap-manager/time-format";

@Component({
  selector: "app-end-game",
  templateUrl: "./end-game.component.html",
  styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent implements OnInit {
  public replayUrl: string;
  public hasValidateOneTime: boolean;

  public constructor(
    public endGameService: EndGameService,
    public highscoreService: HighscoreService) {
    this.hasValidateOneTime = false;
  }

  public ngOnInit(): void {
    this.replayUrl = PLAY_URL + ID_PARAM + this.highscoreService.trackService.currentTrack._id;
    this.endGameService.initPlayers();
    this.highscoreService.updateScores(this.endGameService.players[0].totalTime);
    this.endGameService.sortPlayers();
  }

  public validateName(name: string): void {
    this.hasValidateOneTime = true;
    this.highscoreService.updateHighScores(name);
  }

  public formatTime(num: number): string {
    return TimeFormat.csToString(num);
  }
}
