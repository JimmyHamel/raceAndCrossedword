import { Car } from "../car/car";
import { AIState } from "./abstract-ai-state";
import { AIStateTransitionner } from "./ai-state-transition";
import { Checkpoint } from "../lap-manager/checkpoint";
import { Vector3 } from "three";
import { ADDITIONNAL_RADIUS, ADDITIONNAL_RADIUS_FACTOR } from "../constants";

export class NpcCarAI {
    private npc: Car;
    private checkpoint: Checkpoint;
    private currentState: AIState;
    private stateTransitionner: AIStateTransitionner;

    public constructor(car: Car, checkpoints: Checkpoint) {
        this.npc = car;
        this.checkpoint = checkpoints;
        this.stateTransitionner = new AIStateTransitionner(this.npc);
    }

    public update(dt: number): void {
        this.updateCheckpoint();
        this.updatePosition(dt);
    }

    private updateCheckpoint(): void {
        if (this.npc.meshPosition.distanceTo(this.checkpoint.next.point.position) < this.checkpoint.next.radius
                                                                                    * this.calculateExtraRadius()) {
            this.checkpoint = this.checkpoint.next;
        } else if (this.npc.meshPosition.distanceTo(this.checkpoint.point.position) > this.checkpoint.radius) {
            if (this.isCarOnWrongSideOfCheckpoint()) {
                this.checkpoint = this.checkpoint.previous;
            }
        }
    }

    private calculateExtraRadius(): number {
        return (this.npc.speed.length() + ADDITIONNAL_RADIUS) / ADDITIONNAL_RADIUS_FACTOR;
    }

    private updatePosition(dt: number): void {
        this.currentState = this.stateTransitionner.switchState(this.checkpoint, this.currentState);
        this.currentState.handleState();
        this.npc.update(dt);
    }

    private isCarOnWrongSideOfCheckpoint(): boolean {
        const segmentBefore: Vector3 = this.checkpoint.point.position.clone().sub(this.checkpoint.previous.point.position);
        const segmentAfter: Vector3 = this.checkpoint.next.point.position.clone().sub(this.checkpoint.point.position);
        const distToPoint: Vector3 = this.npc.meshPosition.clone().sub(this.checkpoint.point.position);
        const checkpointDirection: Vector3 = this.checkpoint.line.zLocalAxis;

        return (Math.sign(segmentBefore.clone().cross(segmentAfter).y) === Math.sign(checkpointDirection.clone().cross(distToPoint).y));
    }

    public get car(): Car {
        return this.car;
    }
}
