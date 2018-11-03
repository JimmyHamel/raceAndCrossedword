import { Car } from "../car/car";
import { AIState } from "./abstract-ai-state";

export class MainState extends AIState {
    public constructor(newCar: Car) {
        super(newCar);
    }
    public handleState(): void {
        this.npc.releaseSteering();
        this.npc.releaseBrakes();
        this.npc.accelerate();
    }
}
