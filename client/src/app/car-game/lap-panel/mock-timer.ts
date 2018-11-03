/*const MILLISECOND_IN_CENTISECOND: number = 10;
const CENTISECOND_IN_SECOND: number = 100;
const SECOND_IN_MINUTE: number = 60;

const LIMIT_FORMAT: number = 10;*/
const ZERO_VALUE: number = 0;
const START_TIME: number = 100;
const STOP_TIME: number = 1000;
export class MockTimer {

    private stopTimer: boolean;
    private startTime: number;
    private elapsedTime: number;
    public constructor() {
        this.startTime = ZERO_VALUE;
        this.elapsedTime = ZERO_VALUE;
        this.stopTimer = false;
    }

    public start(): void {
        this.stopTimer = true;
        this.startTime = START_TIME;
    }

    public stop(): void {
        this.stopTimer = false;
        this.elapsedTime = STOP_TIME - this.startTime;
    }

    public get time(): number {
        return this.elapsedTime;
    }

    public set time(time: number) {
        this.elapsedTime = time;
    }

    public get isRunning(): boolean {
        return this.stopTimer;
    }

}
