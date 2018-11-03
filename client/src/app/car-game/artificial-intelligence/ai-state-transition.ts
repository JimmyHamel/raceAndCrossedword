import { Car } from "../car/car";
import { AIState } from "./abstract-ai-state";
import { MainState } from "./main-state";
import { BackwardState } from "./backward-state";
import { RedirectionState } from "./redirection-state";
import { TurnState } from "./turn-state";
import { Vector3 } from "three";
import { DEFAULT_LINE_WIDTH, SIDE_ROAD_RATIO, PARALLELISM_FACTOR, MAXIMUM_STUCK_COUNTER } from "../constants";
import { Checkpoint } from "../lap-manager/checkpoint";

const enum stateType {mainState, backwardState, redirectionState, turnState}

export class AIStateTransitionner {
    private npc: Car;
    private states: AIState[];
    private notMovingCount: number;

    public constructor(newNpc: Car) {
        this.npc = newNpc;
        this.states = [];
        this.notMovingCount = 0;
        this.states[stateType.mainState] = new MainState(this.npc);
        this.states[stateType.backwardState] = new BackwardState(this.npc);
        this.states[stateType.redirectionState] = new RedirectionState(this.npc);
        this.states[stateType.turnState] = new TurnState(this.npc);
    }

    public switchState(checkpoint: Checkpoint, currentState: AIState): AIState {
        const currentDirection: Vector3 = this.npc.speed.clone();
        const dot: number = this.npc.speed.clone().normalize().dot(this.calculateNewDirection(checkpoint));
        let newState: AIState = currentState;
        this.stuckCounter(currentState);
        switch (currentState) {
            case this.states[stateType.mainState]:
                newState = this.calculateMainStateTrans(dot, currentDirection, this.calculateNewDirection(checkpoint), checkpoint);
                break;
            case this.states[stateType.backwardState]:
                newState = this.calculateNewStateTurn(currentState, currentDirection, this.calculateNewDirection(checkpoint), dot);
                newState = this.signalForward(newState);
                break;
            case this.states[stateType.redirectionState]:
                if (this.posToMiddle(checkpoint).length() < DEFAULT_LINE_WIDTH / 2 - 1 ) {
                    newState = this.states[stateType.mainState];
                }
                break;
            case this.states[stateType.turnState]:
                newState = this.calculateNewStateTurn(currentState, currentDirection, this.calculateNewDirection(checkpoint), dot);
                break;
            default:
                newState = this.states[stateType.mainState];
        }
        newState = this.signalBackward(newState, currentDirection, this.calculateNewDirection(checkpoint));

        return newState;
    }

    private signalBackward(currentState: AIState, currentDirection: Vector3, newDirection: Vector3): AIState {
        let state: AIState = currentState;
        if (this.notMovingCount > MAXIMUM_STUCK_COUNTER) {
            state = this.states[stateType.backwardState];
            (state as BackwardState).currentDirection = currentDirection;
            (state as BackwardState).newDirection = newDirection;
            this.notMovingCount = 0;
        }

        return state;
    }

    private signalForward(currentState: AIState): AIState {
        let state: AIState = currentState;
        if (this.notMovingCount > MAXIMUM_STUCK_COUNTER) {
            state = this.states[stateType.mainState];
            this.notMovingCount = 0;
        }

        return state;
    }

    private calculateNewStateTurn(currentState: AIState, currentDirection: Vector3, newDirection: Vector3, dot: number): AIState {
        let state: AIState = currentState;
        (currentState as TurnState|BackwardState).currentDirection = currentDirection;
        (currentState as TurnState|BackwardState).newDirection = newDirection;
        if (Math.abs(dot) >= PARALLELISM_FACTOR) {
            state = this.states[stateType.mainState];
        }

        return state;
    }

    private stuckCounter(currentState: AIState): void {
        if (this.npc.speed.length() < 1 ) {
            this.notMovingCount++;
        }
    }

    private posToMiddle(checkpoint: Checkpoint): Vector3 {
        const pointLineStartDistance: Vector3 = this.npc.meshPosition.clone().sub(checkpoint.point.position);
        const direction: Vector3 = checkpoint.next.point.position.clone().sub(checkpoint.point.position);
        const dot: number = pointLineStartDistance.dot(direction) / (Math.pow(direction.length(), 2));

        return pointLineStartDistance.sub(direction.multiplyScalar(dot));

    }

    private calculateMainStateTrans(dot: number, currentDirection: Vector3, newDirection: Vector3, checkpoint: Checkpoint): AIState {
        let newState: AIState = this.states[stateType.mainState];
        const posToMiddle: Vector3 = this.posToMiddle(checkpoint);
        if (posToMiddle.length() > DEFAULT_LINE_WIDTH * SIDE_ROAD_RATIO) {
            newState = this.states[stateType.redirectionState];
            (newState as RedirectionState).distance = posToMiddle;
        }
        if (dot < PARALLELISM_FACTOR) {
            newState = this.states[stateType.turnState];
            (newState as TurnState).currentDirection = currentDirection;
            (newState as TurnState).newDirection = newDirection;

        }

        return newState;
    }

    private calculateNewDirection(checkpoint: Checkpoint): Vector3 {
        return checkpoint.next.point.position.clone().sub(checkpoint.point.position).normalize();
    }
}
