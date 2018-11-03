import { Component } from "@angular/core";
import { InfoService } from "../info.service";
import { PlayerService } from "../player.service";
import { RoomService } from "../room.service";
import { DIFFICULTY_FR } from "../constants-ui-text";

@Component({
  selector: "app-stats-panel",
  templateUrl: "./stats-panel.component.html",
  styleUrls: ["./stats-panel.component.css"]
})

export class StatsPanelComponent {
  public difficulty: string[];
  public roomIndex: number;
  public constructor(
    public infoService: InfoService,
    public playerService: PlayerService,
    public roomService: RoomService,
  ) {

    this.difficulty = DIFFICULTY_FR;
    this.roomIndex = this.calculateRoomIndex();
  }

  public onClick(): void {
    this.infoService.cheatMode = !this.infoService.cheatMode;
  }

  private calculateRoomIndex(): number {
    for (let i: number = 0; i < this.roomService.rooms().length; i++) {
      if (this.playerService.name === this.roomService.rooms()[i].name) {
        return this.roomIndex = i;
      }
    }

    return 0;
  }
}
