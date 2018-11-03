import * as Io from "socket.io-client";
import { Injectable } from "@angular/core";
import * as Event from "../../../../common/events/events";
import { Room } from "../../../../common/interface/room-interface";
import { WordInterface } from "../../../../common/interface/word-interface";
import { InfoService, WANT_REPLAY } from "./info.service";
import { Router } from "@angular/router";
import {
    BASE_SERVER_URL,
    HOME_URL,
    CROSSWORD_BOARD_URL,
    GameMode,
    MULTIPLAYER_BOARD_URL,
    LOADING_GAME_URL
} from "../../../../common/communication/communication-url";
import { MessengerService } from "./messenger.service";
import { GameObservableService } from "./game-observable.service";
import { GridService } from "./grid/grid.service";

const DISCONNECT_MESSAGE: string = "Vous avez été déconnecté";
const GAME_FULL: string = "Partie pleine";

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;

    public constructor(
        private infoService: InfoService,
        private observable: GameObservableService,
        private messengerService: MessengerService,
        private router: Router,
        private gridService: GridService
    ) {
        this.connect();
    }

    public wordCompleted(index: number): void {
        this.socket.emit(Event.WORD_COMPLETE, index);
    }

    public createRoom(room: Room): void {
        this.socket.emit(Event.NEW_ROOM, room);
        this.infoService.currentPlayer = 0;
    }

    public joinRoom(roomName: string, playername: string): void {
        const room: Room = this.messengerService.rooms.find((x: Room) => x.name === roomName);
        if (room.playerPresent >= room.playerTotal) {
            alert(GAME_FULL);
        } else {
            this.socket.emit(Event.JOIN_ROOM, roomName, playername);
            this.infoService.currentPlayer = 1;
        }
    }

    private connect(): void {
        this.socket = Io.connect(BASE_SERVER_URL);

        this.socket.on(Event.CONNECTION_SUCCEEDED, () => {
            this.messengerService.socket = this.socket;

            this.socket.emit(Event.CONNECTION_SUCCEEDED);

            this.socket.on(Event.SEND_GRID, (grid: string) => {
                this.onGridReceipt(grid);
            });

            this.onWordSelected();

            this.onWordCompleted();

            this.onRoomListUpdate();

            this.onReplay();

            this.onDisconnect();
        });

    }

    private onGridReceipt(grid: string): void {
        const words: WordInterface[] = JSON.parse(grid) as WordInterface[];
        this.gridService.reset();
        this.infoService.changeWords(words);
        this.router.navigate([HOME_URL + CROSSWORD_BOARD_URL + GameMode.multiplayer + MULTIPLAYER_BOARD_URL]);
    }

    private onWordSelected(): void {
        this.socket.on(Event.WORD_SELECTED, (index: number) => {
            this.observable.notifyIndexSecondPlayerSelectedWord(index);
        });
    }

    private onWordCompleted(): void {
        this.socket.on(Event.WORD_COMPLETE, (index: number) => {
            this.observable.notifyIndexSecondPlayerCompletedWord(index);
        });
    }

    private onRoomListUpdate(): void {
        this.socket.on(Event.ROOM_LIST_UPDATE, (rooms: Room[]) => {
            this.messengerService.updateRoomList(rooms);
        });
    }

    private onReplay(): void {
        this.socket.on(Event.REPLAY, () => {
            this.infoService.replay[this.infoService.otherPlayer()] = WANT_REPLAY;
            if (this.infoService.replay[this.infoService.currentPlayer] === WANT_REPLAY) {
                this.router.navigate([HOME_URL + CROSSWORD_BOARD_URL + GameMode.multiplayer + LOADING_GAME_URL]);
            }
        });
    }

    private onDisconnect(): void {
        this.socket.on(Event.DISCONNECTING, () => {
            alert(DISCONNECT_MESSAGE);
            this.router.navigate([HOME_URL]);
            window.location.reload();
        });
    }
}
