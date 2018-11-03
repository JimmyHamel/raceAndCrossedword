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
}

const MAXIMUM_PLAYERS: number = 2;
export class MockServiceMultiplayer {
    public rooms: Map<string, RoomSocket>;

    public createServer(): void {
        this.rooms = new Map<string, RoomSocket>();
    }

    public onNewGame(room: Room): void {
            const roomSocket: RoomSocket = {
                name: room.name,
                difficulty: room.difficulty,
                playerPresent: room.playerPresent,
                playerTotal: room.playerTotal,
                playersname: room.playersname
            };
            this.rooms.set(roomSocket.name, roomSocket);
            roomSocket.playerPresent++;
    }

    public onJoinedGame(roomName: string, playername: string): void {
            if (this.rooms.get(roomName).playerPresent < MAXIMUM_PLAYERS) {
                this.rooms.get(roomName).playerPresent++;
                this.rooms.get(roomName).playersname.push(playername);
                this.requestGrid(this.rooms.get(roomName).difficulty).then((res: WordInterface[]) => {
                    return res;
                }).catch();
            }
    }

    public removeSocketsFromRoom(socket: string): string {
        for (const room of this.rooms.values()) {
            const index: number = room.playersname.indexOf(socket);
            if (index !== -1) {
                const secondSocket: string = room.playersname[1 - index];
                this.rooms.delete(room.name);

                return secondSocket;
            }
        }

        return undefined;
    }

    public async requestGrid(difficulty: Difficulty): Promise<WordInterface[]> {
        const uri: string = Url.BASE_SERVER_URL + Url.GRID_SERVICE_URL + Url.GET_GRID_URL + Url.DIFFICULTY_URL + difficulty;

        return request(uri);
    }
}
