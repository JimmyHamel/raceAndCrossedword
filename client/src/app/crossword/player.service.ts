import { Injectable } from "@angular/core";
import { NO_CONTENT } from "./grid/constant";

const DEFAULT_NAME: string = "you";
const DEFAULT_NUMBER: number = 0;

@Injectable()
export class PlayerService {
  public name: string;
  public number: number;
  public roomName: string;
  public constructor() {
    this.name = DEFAULT_NAME;
    this.number = DEFAULT_NUMBER;
    this.roomName = NO_CONTENT;
  }
  public update(nameInput: string, numberInput: number, roomInput: string): void {
    this.name = nameInput;
    this.number = numberInput;
    this.roomName = roomInput;
  }
}
