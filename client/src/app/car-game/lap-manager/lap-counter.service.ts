import { Injectable } from "@angular/core";
import { Timer } from "../lap-panel/timer";
const TOTAL_LAP_COUNT: number = 3;

@Injectable()
export class LapCounterService {

  public timer: Timer;
  public timersLap: Timer[];
  public currentLap: number;
  public totalLap: number;

  public constructor() {
    this.timer = new Timer();
    this.timersLap = [];
    this.totalLap = TOTAL_LAP_COUNT;
    this.currentLap = 0;
    this.initializeTimes();
  }

  private initializeTimes(): void {
    for (let i: number = 0; i < TOTAL_LAP_COUNT; i++) {
      this.timersLap[i] = new Timer();
    }
  }

  public start(): void {
    this.timer.start();
    this.timersLap[0].start();
  }

  public stop(): void {
    this.timer.stop();
    for (const t of this.timersLap) {
      t.stop();
    }
  }

  public nextLap(): void {
    this.timersLap[this.currentLap].stop();
    this.currentLap++;
    this.timersLap[this.currentLap].start();
  }

  public generateTimes(checkpointPassed: number, totalCheckpoint: number, endTime: number): void {
    if (checkpointPassed < totalCheckpoint) {
      for (let i: number = this.currentLap; i < this.timersLap.length; i++) {
        this.generateLapTime(i, checkpointPassed, totalCheckpoint, endTime);
      }
    }
    this.generateTotalTime();
  }

  private generateLapTime(lap: number, checkpointPassed: number, totalCheckpoint: number, endTime: number): void {
    this.timersLap[lap].time += this.timeByCheckpoint(checkpointPassed, endTime) *
      this.lapCheckpointRemaining(checkpointPassed, totalCheckpoint, lap);
  }

  private lapCheckpointRemaining(checkpointPassed: number, totalCheckpoint: number, lap: number): number {
    if (lap >= ((checkpointPassed / totalCheckpoint) * TOTAL_LAP_COUNT)) {
      return this.checkpointPerLap(totalCheckpoint);
    } else if (this.calculateCheckPointRemaining(checkpointPassed, totalCheckpoint) > 0) {
        return this.calculateCheckPointRemaining(checkpointPassed, totalCheckpoint);
      } else {
        return 0;
      }
    }

  private calculateCheckPointRemaining(checkpointPassed: number, totalCheckpoint: number): number {
      return this.totalCheckpointRemaining(checkpointPassed, totalCheckpoint) -
      (this.fullLapsRemaining(checkpointPassed, totalCheckpoint) * this.checkpointPerLap(totalCheckpoint));
    }

  private generateTotalTime(): void {
    this.timer.time = 0;
    for (const timer of this.timersLap) {
      this.timer.time += timer.time;
    }
  }

  private timeByCheckpoint(checkpointPassed: number, endTime: number): number {
    return endTime / checkpointPassed;
  }

  private fullLapsRemaining(checkpointPassed: number, totalCheckpoint: number): number {
    return TOTAL_LAP_COUNT - Math.ceil(TOTAL_LAP_COUNT * (checkpointPassed / totalCheckpoint));
  }

  private checkpointPerLap(totalCheckpoint: number): number {
    return totalCheckpoint / TOTAL_LAP_COUNT;
  }

  private totalCheckpointRemaining(checkpointPassed: number, totalCheckpoint: number): number {
    return totalCheckpoint - checkpointPassed;
  }

}
