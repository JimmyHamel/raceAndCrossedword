import { Component } from "@angular/core";
import * as Url from "../../../../../common/communication/communication-url";
import { Router } from "@angular/router";
import { GridService } from "../grid/grid.service";
import { InfoService, WANT_REPLAY } from "../info.service";
import { PlayerService } from "../player.service";
import { MessengerService } from "../messenger.service";

@Component({
  selector: "app-result-screen",
  templateUrl: "./result-screen.component.html",
  styleUrls: ["./result-screen.component.css"]
})
export class ResultScreenComponent {

  public constructor(
    private router: Router,
    private gridService: GridService,
    public infoService: InfoService,
    public playerService: PlayerService,
    private messengerService: MessengerService
  ) { }

  public replay(): void {
    this.gridService.reset();
    this.infoService.reset();
    this.router.navigate([Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.singleplayer +
      this.infoService.gridDifficulty]);
  }

  public replayMultiplayer(): void {
    this.infoService.replay[this.infoService.currentPlayer] = WANT_REPLAY;
    this.messengerService.emitReplay();
    if (this.infoService.replay[this.infoService.otherPlayer()] === WANT_REPLAY) {
      this.gridService.reset();
      this.router.navigate([Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.LOADING_GAME_URL]);
      this.messengerService.emitNewGrid(this.playerService.roomName);
    }
  }
}
