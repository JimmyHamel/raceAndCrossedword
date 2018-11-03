import { Injectable } from "@angular/core";
import { Room } from "../../../../common/interface/room-interface";
import { Difficulty } from "../../../../common/interface/word-interface";
import { MessengerService } from "./messenger.service";
import { SocketService } from "./socket.service";

@Injectable()
export class RoomService {

  public constructor(private messengerService: MessengerService, private socketService: SocketService) { }

  public addRoom(nameInput: string, difficultyInput: Difficulty, playername: string): void {
    this.socketService.createRoom({
      name: nameInput,
      difficulty: difficultyInput,
      playerPresent: 0,
      playerTotal: 2,
      playersname: [playername],
    });
  }

  public joinRoom(roomName: string, playername: string): void {
    this.socketService.joinRoom(roomName, playername);
  }

  public rooms(): Room[] {
    return this.messengerService.rooms;
  }
}
