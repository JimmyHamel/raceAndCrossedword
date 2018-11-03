import { Car } from "../car/car";
import { OrientedBoundingRectangle } from "../collision/oriented-bounding-rectangle";
import { Line } from "three";
import { LapCounterService } from "./lap-counter.service";
import { Checkpoint } from "./checkpoint";
import { TOTAL_LAP_COUNT } from "../constants";

const enum MapCheckpoint {
    First,
    Current,
}
export class LapManager {

    private car: Car;
    private checkpoints: Checkpoint[];
    private _checkpointsPassed: number;
    private pointsNumber: number;
    private _currentlap: number;
    private finishLine: OrientedBoundingRectangle;
    private _lapCounterService: LapCounterService;
    private _name: string;

    public constructor(car: Car, checkpoints: Checkpoint, finishLine: Line, name: string, pointsNumber: number) {
        this.car = car;
        this.pointsNumber = pointsNumber;
        this._lapCounterService = new LapCounterService();
        this.checkpoints = [];
        this.checkpoints[MapCheckpoint.First] = checkpoints;
        this.checkpoints[MapCheckpoint.Current] = checkpoints;
        this._currentlap = 1;
        this._checkpointsPassed = 0;
        this.finishLine = new OrientedBoundingRectangle(undefined, finishLine);
        this._name = name;
    }

    public update(): void {
        this.updateCheckpoint();
        this.manageLaps();

        if (this.lapCounterService.timer.time === 0) {
            this.lapCounterService.start();
        }
    }

    public endGame(endTime: number): void {
        this.lapCounterService.stop();
        this.lapCounterService.generateTimes(this.checkpointsPassed, this.pointsNumber * TOTAL_LAP_COUNT, endTime);
    }

    private updateCheckpoint(): void {
        if (this.car.boundingRectangle.intersect(this.checkpoints[MapCheckpoint.Current].next.line)) {
            this.checkpoints[MapCheckpoint.Current] = this.checkpoints[MapCheckpoint.Current].next;
            this._checkpointsPassed++;
        }
    }

    private manageLaps(): void {
        if (this.checkpoints[MapCheckpoint.Current] === this.checkpoints[MapCheckpoint.First] &&
            this._checkpointsPassed > ((this.pointsNumber - 1) * this._currentlap) &&
            this.car.boundingRectangle.intersect(this.finishLine)
        ) {
            this._currentlap++;
            if (this._currentlap <= TOTAL_LAP_COUNT) {
                this.lapCounterService.nextLap();
            } else {
                this.lapCounterService.stop();
            }
        }
    }

    public get currentlap(): number {
        return this._currentlap;
    }

    public get currentCheckpoint(): Checkpoint {
        return this.checkpoints[MapCheckpoint.Current];
    }

    public get checkpointsPassed(): number {
        return this._checkpointsPassed;
    }

    public get lapCounterService(): LapCounterService {
        return this._lapCounterService;
    }
    public get name(): string {
        return this._name;
    }
}
