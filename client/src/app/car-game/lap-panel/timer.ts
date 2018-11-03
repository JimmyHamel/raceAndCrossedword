import { TimeFormat } from "../lap-manager/time-format";

const MILLISECOND_IN_CENTISECOND: number = 10;
const ZERO_VALUE: number = 0;

export class Timer {

    private stopTimer: boolean;
    private startTime: number;
    private elapsedTime: number;
    public constructor() {
        this.startTime = ZERO_VALUE;
        this.elapsedTime = ZERO_VALUE;
        this.stopTimer = false;
    }

    public start(): void {
        this.stopTimer = false;
        this.startTime = Date.now();
        const timer: number = window.setInterval(
            () => {
                this.elapsedTime = Date.now() - this.startTime;
                if (this.stopTimer) {
                    clearInterval(timer);
                }
            },
            MILLISECOND_IN_CENTISECOND);
    }

    public stop(): void {
        this.stopTimer = true;
    }

    public reset(): void {
        this.startTime = ZERO_VALUE;
        this.elapsedTime = ZERO_VALUE;
        this.stopTimer = false;
    }

    public toString(): string {
        return TimeFormat.csToString(this.elapsedTime);

    }

    public get time(): number {
        return this.elapsedTime;
    }

    public set time(time: number) {
        this.elapsedTime = time;
    }
}
