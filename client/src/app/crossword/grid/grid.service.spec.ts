/* tslint:disable */
import { TestBed, inject } from "@angular/core/testing";
import { Box } from "../grid/box-interface";
import { GridService } from "../grid/grid.service";
import { InfoService } from "../info.service";
import { GameObservableService } from "../game-observable.service";
import { MockObservableService } from "../mock/mock-observable.service";
import { MockInfoService } from "../mock/mock-info.service";
import {InitializeService} from "../grid/initializer.service";


describe("GridService", () => {
    let gridService: GridService;
    let observable: GameObservableService;
    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [
                GridService,
                { provide: GameObservableService, useClass: MockObservableService },
                { provide: InfoService, useClass: MockInfoService }
            ]
        });

        gridService = TestBed.get(GridService);
        observable = TestBed.get(GameObservableService);

    });

    it("should validate a word", () => {
        inject([InitializeService], (init: InitializeService) => {
            let hasValidated: boolean = false;

            init.buildGrid();

            const boxes: Box[] = [{
                id: 0,
                config: { "col": 0, "row": 1, "sizex": 1, "sizey": 1 },
                value: "i",
                inWordIndex: [0, 1],
                isWritable: true,
                hasWordFocus: [true, false],
                isWordValid: [false, false]
            },
            {
                id: 10,
                config: { "col": 0, "row": 2, "sizex": 1, "sizey": 1 },
                value: "l",
                inWordIndex: [0, 1],
                isWritable: true,
                hasWordFocus: [true, false],
                isWordValid: [false, false]
            },];

            for (const box of boxes) {
                if (gridService["validateWord"](box, 0)) {
                    hasValidated = true;
                }
            }
            expect(hasValidated).toBe(true);
        });
    });

    it("should know a completed word from the other player", () => {
        inject([InitializeService], (init: InitializeService) => {

            init.buildGrid();
            
            observable.notifyIndexSecondPlayerSelectedWord(0);

            expect(gridService.grid.boxes[10].value).toBe("i");
            expect(gridService.grid.boxes[20].value).toBe("l");
        });
    });
});

