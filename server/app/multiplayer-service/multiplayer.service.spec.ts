/* tslint:disable */
import { MockServiceMultiplayer } from "./mock-multiplayer.service";
import * as assert from "assert";
import { Difficulty } from "../../../common/interface/word-interface";
import { Room } from "../../../common/interface/room-interface";

describe("MultiplayerService : ", () => {

    let multiplayer: MockServiceMultiplayer;

    beforeEach(() => {
        multiplayer = new MockServiceMultiplayer();
        multiplayer.createServer();
    });

    it("should create a list of rooms", (done: MochaDone) => {
        assert.notEqual(multiplayer.rooms, undefined);
        done();
    });

    it("should add a room to the list", (done: MochaDone) => {
        const mockRoom: Room = {
            name: "mockName",
            difficulty: Difficulty.easy,
            playerPresent: 0,
            playerTotal: 1,
            playersname: ["mockPlayer"]
        };
        multiplayer.onNewGame(mockRoom);

        assert.equal(multiplayer.rooms.has(mockRoom.name), true);
        done();
    });

    it("should add the player to the game", (done: MochaDone) => {
        const mockRoom: Room = {
            name: "mockName",
            difficulty: Difficulty.easy,
            playerPresent: 0,
            playerTotal: 1,
            playersname: ["mockPlayer"]
        };
        multiplayer.onNewGame(mockRoom);
        multiplayer.onJoinedGame(mockRoom.name, "mockPlayer2");

        assert.equal(multiplayer.rooms.get(mockRoom.name).playerPresent, 2);
        assert.equal(multiplayer.rooms.get(mockRoom.name).playersname[1], "mockPlayer2");
        done();
    });

    it("should remove the room from the list", (done: MochaDone) => {
        const mockRoom: Room = {
            name: "mockName",
            difficulty: Difficulty.easy,
            playerPresent: 0,
            playerTotal: 1,
            playersname: ["mockPlayer"]
        };
        multiplayer.onNewGame(mockRoom);
        multiplayer.onJoinedGame(mockRoom.name, "mockPlayer2");
        multiplayer.removeSocketsFromRoom("mockPlayer");
        assert.equal(multiplayer.rooms.has(mockRoom.name), false);
        done();
    });
});
