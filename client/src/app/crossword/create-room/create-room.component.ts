import { Component } from "@angular/core";
import { RoomService } from "../room.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Difficulty } from "../../../../../common/interface/word-interface";
import { PlayerService } from "../player.service";
import { WAITING_CONNECTION_URL } from "../../../../../common/communication/communication-url";
import { DIFFICULTY_FR } from "../constants-ui-text";

const EMPTY_STRING: string = "";
const DEFAULT_DIFFICULTY: number = -1;
const PLAYER_TO_CONNECT: number = 1;
const NOT_VALID: boolean = false;
const DEFAULT_PLAYER: string = "Default Player";
const DEFAULT_GAME: string = "My Default Game";

const enum Input {
  roomName = 0,
  difficulty = 1,
  playerName = 2,
}
@Component({
  selector: "app-create-room",
  templateUrl: "./create-room.component.html",
  styleUrls: ["./create-room.component.css"]
})

export class CreateRoomComponent {
  public difficulty: string[];
  private selectedDifficulty: Difficulty;
  public name: string;
  public invalid: boolean[];

  public constructor(
    public roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute,
    private playerservice: PlayerService
  ) {
    this.difficulty = DIFFICULTY_FR;
    this.selectedDifficulty = DEFAULT_DIFFICULTY;
    this.name = EMPTY_STRING;
    this.invalid = [NOT_VALID, NOT_VALID, NOT_VALID];
  }

  public onClickRadio(diff: number): void {
    this.selectedDifficulty = diff;
  }

  private validateDifficulty(): boolean {
    return !(this.selectedDifficulty === DEFAULT_DIFFICULTY);
  }

  private validateName(nameInput: string): boolean {
    return !(nameInput === EMPTY_STRING || nameInput === null);
  }

  public validForm(roomNameInput: string, playerNameInput: string): void {
    this.invalid[Input.roomName] = !this.validateName(roomNameInput);
    if (this.invalid[Input.roomName]) {
      return;
    }
    this.invalid[Input.difficulty] = !this.validateDifficulty();
    if (this.invalid[Input.difficulty]) {
      return;
    }
    this.invalid[Input.playerName] = !this.validateName(playerNameInput);
    if (this.invalid[Input.playerName]) {
      return;
    }
    this.playerservice.update(playerNameInput, PLAYER_TO_CONNECT, roomNameInput);
    this.roomService.addRoom(roomNameInput, this.selectedDifficulty, this.playerservice.name);
    this.router.navigate(["../" + WAITING_CONNECTION_URL], { relativeTo: this.route });
  }
  public validDefault(): void {
    this.selectedDifficulty = Difficulty.easy;
    this.validForm(DEFAULT_GAME, DEFAULT_PLAYER);
  }

}
