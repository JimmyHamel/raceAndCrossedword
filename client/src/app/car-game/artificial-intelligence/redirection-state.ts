import { AIState } from "./abstract-ai-state";
import { Car } from "../car/car";
import { Vector3 } from "three";

export class RedirectionState extends AIState {
    private _distance: Vector3;

    public constructor(newCar: Car, distanceToMiddle?: Vector3) {
        super(newCar);
        this.distance = distanceToMiddle;
    }
    public handleState(): void {
        if (this._distance.clone().cross(this.npc.speed).y < 0) {
            this.npc.steerRight();
        } else {
            this.npc.steerLeft();
        }
    }
    public set distance(newDistance: Vector3) {
        this._distance = newDistance;
    }
}
