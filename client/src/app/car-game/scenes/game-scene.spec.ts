import { TestBed } from "@angular/core/testing";
import { GameScene } from "../scenes/game-scene";
import { LapService } from "../lap-manager/lap.service";

/*tslint:disable*/
describe("GameScene", () => {
    let gameScene: GameScene;
    let lapService: LapService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [gameScene, lapService]
        });
    });

    it("should alternate cameras correctly", () => {
        gameScene = new GameScene(lapService);
        expect(gameScene["perspectiveCameraIsActive"]).toBe(false);
        gameScene.changeView();
        expect(gameScene["perspectiveCameraIsActive"]).toBe(true);
    });

});
