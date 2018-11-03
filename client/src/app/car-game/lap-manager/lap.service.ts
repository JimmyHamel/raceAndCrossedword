import { Car } from "../car/car";
import { Path } from "../track-editor/path";
import { LapManager } from "./lap-manager";
import { Router } from "@angular/router";
import { END_GAME_URL } from "../../../../../common/communication/communication-url";
import { Injectable } from "@angular/core";
import { Line } from "three";
import { LapCounterService } from "./lap-counter.service";
import { GameScene } from "../scenes/game-scene";
import { TOTAL_LAP_COUNT } from "../constants";
import { Checkpoint } from "./checkpoint";

@Injectable()
export class LapService {
    private _cars: Car[];
    private _path: Path;
    private _checkpoints: Checkpoint;
    public lapManagers: LapManager[];
    public ready: boolean;

    public constructor(private router: Router) {
        this.router = router;
        this.lapManagers = [];
        this.ready = false;
    }

    public update(scene: GameScene): void {
        for (const manager of this.lapManagers) {
            manager.update();
        }
        if (this.raceIsOver()) {
            this.handleEndGame(scene);
        }
    }

    private handleEndGame(scene: GameScene): void {
        this.stopAllTimers();
        for (const manager of this.lapManagers) {
            manager.endGame(this.lapManagers[0].lapCounterService.timer.time);
        }

        scene.isPlayable = false;
        this.router.navigate([END_GAME_URL]);
    }

    private stopAllTimers(): void {
        for (const manager of this.lapManagers) {
            manager.lapCounterService.stop();
        }
    }
    public initManagers(finishLine: Line): void {
        for (let i: number = 0; i < this._cars.length; i++) {
            this.lapManagers[i] = new LapManager(this._cars[i], this._checkpoints, finishLine, "" + (i + 1), this._path.points.length);
        }
        this.ready = true;
    }

    public get playerCounterService(): LapCounterService {
        return this.lapManagers[0].lapCounterService;
    }

    public get playerManager(): LapManager {
        return this.lapManagers[0];
    }

    private raceIsOver(): boolean {
        if (this.lapManagers[0]) {
            return this.lapManagers[0].currentlap === (TOTAL_LAP_COUNT + 1);
        } else {
            return false;
        }
    }

    public set cars(cars: Car[]) {
        this._cars = cars;
    }

    public set path(path: Path) {
        this._path = path;
    }

    public set checkpoints(checkpoint: Checkpoint) {
        this._checkpoints = checkpoint;
    }

    public getCarCurrentCheckpoint(car: Car): Checkpoint {
        for (const managerNumber in this.lapManagers) {
            if (car === this._cars[managerNumber]) {
                return this.lapManagers[managerNumber].currentCheckpoint;
            }
        }

        return undefined;
    }
}
