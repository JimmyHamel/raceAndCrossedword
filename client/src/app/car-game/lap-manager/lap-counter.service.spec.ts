/* tslint:disable */
import { TestBed } from "@angular/core/testing";
import { LapCounterService } from "./lap-counter.service";
import { MockLapCounterService } from "./mock-lap-counter.service";

describe("LapCounterService", () => {
    let lapCounterService: LapCounterService;
    beforeEach(() => {
        TestBed.configureTestingModule({

            providers: [
                LapCounterService
            ]
        });

        lapCounterService = TestBed.get(LapCounterService);
    });

    it("should find the time by checkpoint", () => {
        expect(lapCounterService["timeByCheckpoint"](10, 30000)).toBe(3000);
    });

    it("should find the number of laps remaining", () => {
        expect(lapCounterService["fullLapsRemaining"](20,30)).toBe(1);
    });

    it("should find the number of checkpoints per laps ", () => {
        expect(lapCounterService["checkpointPerLap"](30)).toBe(10);
    });

    it("should find the number of checkpoints remaining ", () => {
        expect(lapCounterService["totalCheckpointRemaining"](15, 30)).toBe(15);
    });

    it("should find the number of checkpoints remaining ", () => {
        expect(lapCounterService["lapCheckpointRemaining"](10, 27, 1)).toBe(8);
    });

    it("should find the number of checkpoints remaining for first lap while in first lap", () => {
        expect(lapCounterService["lapCheckpointRemaining"](9, 30, 0)).toBe(1);
    });
    it("should find the number of checkpoints remaining for second lap while in first lap", () => {
        expect(lapCounterService["lapCheckpointRemaining"](9, 30, 1)).toBe(10);
    });
    it("should find the number of checkpoints remaining for third lap while in first lap", () => {
        expect(lapCounterService["lapCheckpointRemaining"](9, 30, 2)).toBe(10);
    });
    it("should find the number of checkpoints remaining for second lap while in second lap", () => {
        expect(lapCounterService["lapCheckpointRemaining"](10, 30, 1)).toBe(10);
    });
    it("should find the number of checkpoints remaining for third lap while in second lap", () => {
        expect(lapCounterService["lapCheckpointRemaining"](15, 30, 2)).toBe(10);
    });
    it("should find the number of checkpoints remaining for third lap while in third lap", () => {
        expect(lapCounterService["lapCheckpointRemaining"](20, 30, 2)).toBe(10);
    });

    it("should generate a total time", () => {
        lapCounterService.timersLap[0].time = 30000;
        lapCounterService.timersLap[1].time = 0;
        lapCounterService.timersLap[2].time = 0;
        lapCounterService["generateTotalTime"]();
        expect(lapCounterService.timer.time).toBe(30000);
    });

    it("should generate a lap time for first lap ", () => {
        lapCounterService.timersLap[0].time = 30000;
        lapCounterService["generateLapTime"](0, 5, 30, 30000);
        expect(lapCounterService.timersLap[0].time).toBe(60000);
    });

    it("should generate a lap time for second lap ", () => {
        lapCounterService["generateLapTime"](1, 12, 30, 30000);
        expect(lapCounterService.timersLap[1].time).toBe(20000);
    });

    it("should generate a lap time for third lap ", () => {
        lapCounterService["generateLapTime"](2, 28, 30, 28000);
        expect(lapCounterService.timersLap[2].time).toBe(2000);
    });

    it("should generate all times while in first lap", () => {
        lapCounterService.currentLap = 0;
        lapCounterService.timer.time = 30000;
        lapCounterService.timersLap[0].time = 30000;
        lapCounterService.timersLap[1].time = 0;
        lapCounterService.timersLap[2].time = 0;
        lapCounterService.generateTimes(5, 30, 30000);
        expect(lapCounterService.timer.time).toBe(180000);
        expect(lapCounterService.timersLap[0].time).toBe(60000);
        expect(lapCounterService.timersLap[1].time).toBe(60000);
        expect(lapCounterService.timersLap[2].time).toBe(60000);
    });

    it("should generate all times while in second lap", () => {
        lapCounterService.currentLap = 1;
        lapCounterService.timer.time = 30000;
        lapCounterService.timersLap[0].time = 5000;
        lapCounterService.timersLap[1].time = 25000;
        lapCounterService.timersLap[2].time = 0;
        lapCounterService.generateTimes(12, 30, 30000);
        expect(lapCounterService.timer.time).toBe(75000);
        expect(lapCounterService.timersLap[0].time).toBe(5000);
        expect(lapCounterService.timersLap[1].time).toBe(45000);
        expect(lapCounterService.timersLap[2].time).toBe(25000);
    });

    it("should generate all times while in third lap", () => {
        lapCounterService.currentLap = 2;
        lapCounterService.timer.time = 30000;
        lapCounterService.timersLap[0].time = 5000;
        lapCounterService.timersLap[1].time = 24900;
        lapCounterService.timersLap[2].time = 100;
        lapCounterService.generateTimes(24, 30, 30000);
        expect(lapCounterService.timer.time).toBe(37500);
        expect(lapCounterService.timersLap[0].time).toBe(5000);
        expect(lapCounterService.timersLap[1].time).toBe(24900);
        expect(lapCounterService.timersLap[2].time).toBe(7600);
    });


    it("should find the number of checkpoints remaining ", () => {
        expect(lapCounterService["lapCheckpointRemaining"](10, 27, 1)).toBe(8);
    });

    it("should start pricipal Timer and firstLap timer",()=>{
        let mockcounter: MockLapCounterService = new MockLapCounterService();
        mockcounter.start();
        expect(mockcounter.timer.isRunning).toBeTruthy();
        expect(mockcounter.timersLap[0].isRunning).toBeTruthy();
    });

    it("should stop timer lap 1 and start timer lap 2",()=>{
        let mockcounter: MockLapCounterService = new MockLapCounterService();
        mockcounter.start();
        mockcounter.nextLap();
        expect(mockcounter.timer.isRunning).toBeTruthy();
        expect(mockcounter.timersLap[0].isRunning).toBeFalsy();
        expect(mockcounter.timersLap[1].isRunning).toBeTruthy();
    });

    it("should stop timer lap 2 and start timer lap 3",()=>{
        let mockcounter: MockLapCounterService = new MockLapCounterService();
        mockcounter.start();
        mockcounter.nextLap();
        mockcounter.nextLap();
        expect(mockcounter.timer.isRunning).toBeTruthy();
        expect(mockcounter.timersLap[1].isRunning).toBeFalsy();
        expect(mockcounter.timersLap[2].isRunning).toBeTruthy();
    });

    it("should stop pricipal timer after 3 laps",()=>{
        let mockcounter: MockLapCounterService = new MockLapCounterService();
        mockcounter.start();
        mockcounter.nextLap();
        mockcounter.nextLap();
        mockcounter.stop();
        expect(mockcounter.timer.isRunning).toBeFalsy();
    });

    it("should generate an accurate time for each lap", () => {
        lapCounterService.currentLap = 1;
        lapCounterService.timer.time = 38000;
        lapCounterService.timersLap[0].time = 35000;
        lapCounterService.timersLap[1].time = 3000;
        lapCounterService.timersLap[2].time = 0;
        lapCounterService.generateTimes(10, 27, 38000);
        expect(lapCounterService.timer.time).toBe(102600);
        expect(lapCounterService.timersLap[0].time).toBe(35000);
        expect(lapCounterService.timersLap[1].time).toBe(33400);
        expect(lapCounterService.timersLap[2].time).toBe(34200);
    });
});

