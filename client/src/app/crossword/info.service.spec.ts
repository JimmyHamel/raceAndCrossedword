import { TestBed, inject } from "@angular/core/testing";
import { AppModule } from "../app.module";
import { InfoService } from "../crossword/info.service";
import { GameObservableService } from "./game-observable.service";
import { MessengerService } from "./messenger.service";

describe("InfoService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [ GameObservableService, MessengerService ]
        });
    });

    it("should be created", () => {
        inject([InfoService], (service: InfoService) => {
            expect(service).toBeTruthy();
        });
    });
});
