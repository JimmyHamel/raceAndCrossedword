import { Injectable } from "@angular/core";
import { Player } from "./player-interface";
import { LapService } from "../lap-manager/lap.service";
import { PLAYER_NAME } from "../constants";
@Injectable()
export class EndGameService {

    public players: Player[];

    public constructor(private lapService: LapService) {
        this.players = [];
    }

    public sortPlayers(): void {
        this.players.sort((p1: Player, p2: Player) => {
            return p1.totalTime - p2.totalTime;
        });
    }

    public findPlayerOrderOfArrival(): number {
        let pos: number;
        for (let i: number = 0; i < this.players.length; i++) {
            if (this.players[i].name === PLAYER_NAME) {
                pos = i;
            }
        }

        return pos;
    }

    public initPlayers(): void {
        for (let i: number = 0; i < this.lapService.lapManagers.length; i++) {
            const lapTimes: string[] = [];
            for (let j: number = 0; j < this.lapService.lapManagers[i].lapCounterService.timersLap.length; j++) {
                lapTimes[j] = this.lapService.lapManagers[i].lapCounterService.timersLap[j].toString();
            }

            this.players[i] = {
                name: this.lapService.lapManagers[i].name,
                totalTime: this.lapService.lapManagers[i].lapCounterService.timer.time,
                lapTimes: lapTimes,
            };
        }
    }
}
