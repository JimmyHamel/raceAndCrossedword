import { Component } from "@angular/core";
import { RoomService } from "../room.service";
import { PlayerService } from "../player.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LOADING_GAME_URL } from "../../../../../common/communication/communication-url";
import { DIFFICULTY_FR } from "../constants-ui-text";

const URL_PREFIX: string = "../";
const NAME_REQUEST: string = "Entrez votre nom : ";
const PLAYER_NUMBER: number = 2;

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.css"]
})

export class LobbyComponent {

  public difficulty: string[];

  public constructor(
    public roomService: RoomService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.difficulty = DIFFICULTY_FR;
  }

  public joinRoom(roomName: string): void {
    this.playerService.update(prompt(NAME_REQUEST), PLAYER_NUMBER, roomName);
    this.roomService.joinRoom(this.playerService.roomName, this.playerService.name );
    this.router.navigate([URL_PREFIX + LOADING_GAME_URL], { relativeTo: this.route });
  }
}
