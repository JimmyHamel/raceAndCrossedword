import * as Event from "../../../../common/events/events";
import { Injectable } from "@angular/core";
import { Room } from "../../../../common/interface/room-interface";

@Injectable()
export class MessengerService {
    private _socket: SocketIOClient.Socket;
    private _rooms: Room[];

    public constructor() {
        this._rooms = [];
    }

    public set socket(socket: SocketIOClient.Socket) {
        this._socket = socket;
    }

    public updateRoomList(rooms: Room[]): void {
        this._rooms = rooms;
    }

    public get rooms(): Room[] {
        return this._rooms;
    }
    public emitCompletedWord(index: number): void {
        if (this._socket) {
            this._socket.emit(Event.WORD_COMPLETE, index);
        }
    }

    public emitSelectedWord(index: number): void {
        if (this._socket) {
            this._socket.emit(Event.WORD_SELECTED, index);
        }
    }

    public emitReplay(): void {
        if (this._socket) {
            this._socket.emit(Event.REPLAY);
        }
    }

    public emitNewGrid(roomName: string): void {
        if (this._socket) {
            this._socket.emit(Event.NEW_GRID, roomName);
        }
    }
}
