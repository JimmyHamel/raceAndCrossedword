/* tslint:disable */
import { TestBed } from "@angular/core/testing";

import { EndGameService } from "./end-game.service";
import { LapService } from "../lap-manager/lap.service";
import { Router } from "@angular/router";

class MockRouter {
    public navigate = jasmine.createSpy("navigate");
}
describe("EndGameService", () => {
    let mockRouter: MockRouter;
    let endGameService: EndGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EndGameService,
                        LapService,
                        { provide: Router, useValue: mockRouter }]
      });
        endGameService = TestBed.get(EndGameService);
    });

    it("should sort by total Time", () => {
        endGameService.players = [
          { name: "1", totalTime: 200, lapTimes: [] },
          { name: "2", totalTime: 100, lapTimes: [] },
          { name: "3", totalTime: 300, lapTimes: [] },
          { name: "4", totalTime: 400, lapTimes: [] }];

        endGameService.sortPlayers();

        expect(endGameService.players[0].name).toBe("2");
      });

    it("should find order of arrival", () => {
        endGameService.players = [
          { name: "1", totalTime: 200, lapTimes: [] },
          { name: "2", totalTime: 100, lapTimes: [] },
          { name: "3", totalTime: 300, lapTimes: [] },
          { name: "4", totalTime: 400, lapTimes: [] }];

        endGameService.sortPlayers();

        expect(endGameService.findPlayerOrderOfArrival()).toBe(1);
      });
    it("should be in last position of array", () => {
        endGameService.players = [
          { name: "1", totalTime: 400, lapTimes: [] },
          { name: "2", totalTime: 100, lapTimes: [] },
          { name: "3", totalTime: 300, lapTimes: [] },
          { name: "4", totalTime: 200, lapTimes: [] }];

        endGameService.sortPlayers();

        expect(endGameService.players[3].name).toBe("1");
      });

});
