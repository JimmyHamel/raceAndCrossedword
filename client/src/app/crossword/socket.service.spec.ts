/*tslint:disable*/
import { TestBed, inject } from "@angular/core/testing";
import { AppModule } from "../app.module";
import { InfoService } from "../crossword/info.service";
import { GameObservableService } from "./game-observable.service";
import { MessengerService } from "./messenger.service";
import { SocketService } from "./socket.service";
import { Router } from "@angular/router";
import { MockGrid } from "./mock/mock-grid";
import { HOME_URL, CROSSWORD_BOARD_URL, GameMode } from "../../../../common/communication/communication-url";

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe("SocketService", () => {
    let mockRouter: MockRouter;
    beforeEach(() => {
        mockRouter = new MockRouter();
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [ InfoService, GameObservableService, MessengerService, { provide: Router, useValue: mockRouter } ]
        });
    });

    it("should be created", () => {
        inject([SocketService], (service: SocketService) => {
            expect(service).toBeTruthy();
        });
    });

    it("should navigate on grid receipt", () => {
        inject([SocketService], (service: SocketService) => {
            let mockGrid: MockGrid = new MockGrid();
            service["onGridReceipt"](mockGrid.stringWords);
            expect(mockRouter.navigate).toHaveBeenCalledWith([HOME_URL + CROSSWORD_BOARD_URL + GameMode.multiplayer + "game"]);
        });
    });

    it("should navigate on disconnection", () => {
        inject([SocketService], (service: SocketService) => {
            service["onDisconnect"]();
            expect(mockRouter.navigate).toHaveBeenCalledWith([HOME_URL]);
        });
    });
});
