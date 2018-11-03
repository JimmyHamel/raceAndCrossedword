/* tslint:disable */
import { TestBed, inject } from "@angular/core/testing";

import { HighscoreService } from "./highscore.service";
import { MockHighscoreService } from "./mock-highscore.service";
import { TrackService } from "../track-list/track.service";
import { MockTrackService } from "../track-list/mock-track.service";

describe("HighscoreService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HighscoreService, useClass: MockHighscoreService },
                  { provide: TrackService, useClass: MockTrackService }]
    });
  });

  it("should be created", inject([HighscoreService], (service: HighscoreService) => {
    expect(service).toBeTruthy();
  }));

  it("should not modify highscores ", inject([HighscoreService], (service: HighscoreService) => {
    const service2: MockHighscoreService = new MockHighscoreService();
    service.updateScores(15000);
    service.updateHighScores("10");

    expect(service.getHighScores()).toBe(service2.getHighScores());
  }));

  it("should modify highscores", inject([HighscoreService], (service: HighscoreService) => {
    service.updateScores(9000);
    service.updateHighScores("10");

    expect(service.getHighScores()[0].by).toBe("10");
  }));

  it("should be length 5 after modification", inject([HighscoreService], (service: HighscoreService) => {
    service.updateScores(9000);
    service.updateHighScores("10");

    expect(service.getHighScores().length).toBe(5);
  }));

  it("should have custom name link to best time", inject([HighscoreService], (service: HighscoreService) => {
    service.updateScores(8000);
    service.updateHighScores("Custom Name");

    expect(service.getHighScores()[0].by).toBe("Custom Name");
  }));

  it("should push new Highscore to trackService", inject([HighscoreService], (service: HighscoreService)=>{
    expect(service["pushNewHighScore"]()).toBe(200);
  }));
});
