import { Car } from "../car/car";
import { AIState } from "./abstract-ai-state";
import { Vector3 } from "three";
import { Y_AXIS } from "../constants";

export class TurnState extends AIState {
    private _newDirection: Vector3;
    private _currentDirection: Vector3;

    public constructor(newCar: Car, newDirection?: Vector3, currentDirection?: Vector3) {
        super(newCar);
        this._newDirection = newDirection;
        this._currentDirection = currentDirection;
    }
    public handleState(): void {
        this.npc.releaseSteering();
        this.npc.accelerate();
        if (this._currentDirection.dot(this._newDirection.cross(Y_AXIS)) < 0) {
            this.npc.steerRight();
        } else {
            this.npc.steerLeft();
        }
    }
    public set newDirection(direction: Vector3) {
        this._newDirection = direction;
   }
    public set currentDirection(direction: Vector3) {
        this._currentDirection = direction;
    }
}
