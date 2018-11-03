import { injectable, } from "inversify";
import * as http from "http";
import * as Io from "socket.io";
import * as Event from "../../../common/events/events";
import { Room } from "../../../common/interface/room-interface";
import * as request from "request-promise-native";
import { WordInterface, Difficulty } from "../../../common/interface/word-interface";
import * as Url from "../../../common/communication/communication-url";

interface RoomSocket {
    name: string;
    difficulty: Difficulty;
    playerPresent: number;
    playerTotal: number;
    playersname: Array<string>;
    sockets: Array<SocketIO.Socket>;
}

const NO_ROOM: string = "";
const MAXIMUM_PLAYERS: number = 2;
const GRID_SENDING_ERROR: string = "Erreur d'envoi de la grille";
@injectable()
export class ServiceMultiplayer {
    private socketServer: SocketIO.Server;
    private rooms: Map<string, RoomSocket>;

    public createServer(server: http.Server): void {
        this.socketServer = Io(server);
        this.rooms = new Map<string, RoomSocket>();
        this.initializeSocketListeners();
    }

    private initializeSocketListeners(): void {
        this.socketServer.on(Event.CONNECTION, (socket: SocketIO.Socket) => {
            this.onSuccessfulConnection(socket);

            this.onNewGame(socket);

            this.onJoinedGame(socket);

            this.onDisconnect(socket);

            this.onSelectedWord(socket);

            this.onCompletedWord(socket);

            this.onReplay(socket);

            this.onNewGrid(socket);
        });
    }

    private onSuccessfulConnection(socket: SocketIO.Socket): void {
        socket.emit(Event.CONNECTION_SUCCEEDED);
        socket.on(Event.CONNECTION_SUCCEEDED, () => {
            socket.emit(Event.ROOM_LIST_UPDATE, this.roomsMapToArray());
        });
    }

    private onSelectedWord(socket: SocketIO.Socket): void {
        socket.on(Event.WORD_SELECTED, (index: number) => {
            socket.broadcast.to(this.findRoomNameFromSocket(socket)).emit(Event.WORD_SELECTED, index);
        });
    }

    private onCompletedWord(socket: SocketIO.Socket): void {
        socket.on(Event.WORD_COMPLETE, (index: number) => {
            socket.broadcast.to(this.findRoomNameFromSocket(socket)).emit(Event.WORD_COMPLETE, index);
        });
    }

    private onReplay(socket: SocketIO.Socket): void {
        socket.on(Event.REPLAY, () => {
            socket.broadcast.to(this.findRoomNameFromSocket(socket)).emit(Event.REPLAY);
        });
    }

    private onNewGrid(socket: SocketIO.Socket): void {
        socket.on(Event.NEW_GRID, (roomName: string) => {
            this.requestGrid(this.rooms.get(roomName).difficulty).then((res: WordInterface[]) => {
                this.socketServer.to(roomName).emit(Event.SEND_GRID, res);
            }).catch(() => socket.emit(Event.ERROR, GRID_SENDING_ERROR));
        });
    }

    private onNewGame(socket: SocketIO.Socket): void {
        socket.on(Event.NEW_ROOM, (room: Room) => {
            const roomSocket: RoomSocket = {
                name: room.name,
                difficulty: room.difficulty,
                playerPresent: room.playerPresent,
                playerTotal: room.playerTotal,
                playersname: room.playersname,
                sockets: []
            };
            roomSocket.sockets.push(socket);
            this.rooms.set(roomSocket.name, roomSocket);
            roomSocket.playerPresent++;
            socket.join(roomSocket.name);
            this.socketServer.emit(Event.ROOM_LIST_UPDATE, this.roomsMapToArray());
        });
    }

    private onJoinedGame(socket: SocketIO.Socket): void {
        socket.on(Event.JOIN_ROOM, (roomName: string, playername: string) => {
            if (this.rooms.get(roomName).playerPresent < MAXIMUM_PLAYERS) {
                socket.join(roomName);
                this.rooms.get(roomName).playerPresent++;
                this.rooms.get(roomName).playersname.push(playername);
                this.rooms.get(roomName).sockets.push(socket);
                this.socketServer.emit(Event.ROOM_LIST_UPDATE, this.roomsMapToArray());
                this.requestGrid(this.rooms.get(roomName).difficulty).then((res: WordInterface[]) => {
                    this.socketServer.to(roomName).emit(Event.SEND_GRID, res);
                }).catch(() => socket.emit(Event.ERROR, GRID_SENDING_ERROR));
            }
        });
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        socket.on(Event.DISCONNECTING, () => {
            const secondSocket: SocketIO.Socket = this.removeSocketsFromRoom(socket);
            if (secondSocket) {
                secondSocket.disconnect(true);
                this.socketServer.emit(Event.ROOM_LIST_UPDATE, this.roomsMapToArray());
            }
        });
    }

    private findRoomNameFromSocket(socket: SocketIO.Socket): string {
        for (const roomName in socket.rooms) {
            if (this.rooms.get(roomName)) {
                return roomName;
            }
        }

        return NO_ROOM;
    }

    private removeSocketsFromRoom(socket: SocketIO.Socket): SocketIO.Socket {
        for (const room of this.rooms.values()) {
            const index: number = room.sockets.indexOf(socket);
            if (index !== -1) {
                const secondSocket: SocketIO.Socket = room.sockets[1 - index];
                this.rooms.delete(room.name);

                return secondSocket;
            }
        }

        return undefined;
    }

    private roomsMapToArray(): Room[] {
        const array: Room[] = [];
        for (const room of this.rooms.values()) {
            array.push({
                name: room.name,
                difficulty: room.difficulty,
                playerPresent: room.playerPresent,
                playerTotal: room.playerTotal,
                playersname: room.playersname
            });
        }

        return array;
    }

    public async requestGrid(difficulty: Difficulty): Promise<WordInterface[]> {
        const uri: string = Url.BASE_SERVER_URL + Url.GRID_SERVICE_URL + Url.GET_GRID_URL + Url.DIFFICULTY_URL + difficulty;

        return request(uri);
    }
}
