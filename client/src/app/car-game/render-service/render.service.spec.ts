/* tslint:disable */
import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";

import { LapService } from "../lap-manager/lap.service";
import { Router } from "@angular/router";
import { HighscoreService } from "../end-game/highscore.service";
import { EndGameService } from "../end-game/end-game.service";
import { MockHighscoreService } from "../end-game/mock-highscore.service";
import { MockLapService } from "../lap-manager/mock-lap.service";

class MockRouter {
    public navigate: jasmine.Spy = jasmine.createSpy("navigate");
}

describe("RenderService", () => {
    let renderService: RenderService;
    let mockRouter: MockRouter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService,
                        { provide: LapService, useClass: MockLapService},
                        { provide: Router, useValue: mockRouter },
                        { provide: HighscoreService, useClass: MockHighscoreService },
                        EndGameService]
        });
    });

    beforeEach(inject([RenderService], async (service: RenderService) => {
        renderService = service;
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);
        await renderService.initialize(container, false, false);
    }));

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(renderService).toBeTruthy();
    }));
});
