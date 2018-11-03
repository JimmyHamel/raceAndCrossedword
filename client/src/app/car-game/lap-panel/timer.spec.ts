import { MockTimer } from "./mock-timer";

describe("Timer", () => {
  let timer: MockTimer;

  beforeEach(() => {
    timer = new MockTimer();
  });

  it("should create", () => {
    expect(timer).toBeTruthy();
  });

  it("should start running", () => {
    timer.start();
    expect(timer.isRunning).toBeTruthy();
  });

  it("should stop running", () => {
    timer.start();
    timer.stop();
    expect(timer.isRunning).toBe(false);
  });

  it("should not have time = 0", () => {
    timer.start();
    timer.stop();
    expect(timer.time).toBeGreaterThan(0);
  });

  it("should have different time", () => {
    const timer2: MockTimer = new MockTimer();
    timer.start();
    timer.stop();
    expect(timer.time).toBeGreaterThan(timer2.time);
  });
});
