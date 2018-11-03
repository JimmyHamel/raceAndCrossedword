/*tslint:disable*/
import { TestBed, inject } from "@angular/core/testing";
import { AppModule } from "../app.module";
import { InfoService } from "../crossword/info.service";
import { GameObservableService } from "./game-observable.service";
import { MessengerService } from "./messenger.service";
import { GridResolve } from "./grid-resolver";
import { GridGetterService } from "./grid-getter.service";

describe("GridResolve", () => {


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [ GridResolve, GridGetterService, InfoService, GameObservableService, MessengerService ]
        });
    });

    it("should be created", () => {
        inject([GridResolve], (service: GridResolve) => {
            expect(service).toBeTruthy();
        });
    });


    it("should have an easy grid difficulty", () => {
        inject([GridResolve], (service: GridResolve) => {
            let route = jasmine.createSpyObj('Route', ['']);
            route.params = {
                'SINGLEPLAYER_DIFFICULTY': "0"
            }
            service.resolve(route.snapshot);
            expect(service["infoService"].gridDifficulty).toBe("0");
        });
    });

    it("should have a medium grid difficulty", () => {
        inject([GridResolve], (service: GridResolve) => {
            let route = jasmine.createSpyObj('Route', ['']);
            route.params = {
                'SINGLEPLAYER_DIFFICULTY': "1"
            }
            service.resolve(route.snapshot);
            expect(service["infoService"].gridDifficulty).toBe("1");
        });
    });

    it("should have a hard grid difficulty", () => {
        inject([GridResolve], (service: GridResolve) => {
            let route = jasmine.createSpyObj('Route', ['']);
            route.params = {
                'SINGLEPLAYER_DIFFICULTY': "2"
            }
            service.resolve(route.snapshot);
            expect(service["infoService"].gridDifficulty).toBe("2");
        });
    });
});
