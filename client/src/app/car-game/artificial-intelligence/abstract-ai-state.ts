import { Car } from "../car/car";

export abstract class AIState {
    protected npc: Car;
    public constructor(newNpc: Car) {
        this.npc = newNpc;
    }
    public abstract handleState(): void;
}
